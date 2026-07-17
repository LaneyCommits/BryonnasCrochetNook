import { useEffect, useRef, useState } from "react";
import { findShopItem, getShopItemGroups } from "../shopCatalog";

const FORMSPREE_CUSTOM_ORDER_URL = "https://formspree.io/f/xgolykoe";
const CUSTOM_ORDER_MIN_FORM_AGE_MS = 3000;
const CUSTOM_ORDER_MIN_INTERVAL_MS = 10_000;
const CUSTOM_ORDER_SUCCESS_COOLDOWN_MS = 90_000;

const ITEM_GROUPS = getShopItemGroups();
const FULLY_CUSTOM_VALUE = "fully-custom";

export default function CustomOrderPage({ preselectedItemId = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notes: "",
  });
  const [itemId, setItemId] = useState(preselectedItemId || "");
  const [spamTrap, setSpamTrap] = useState("");
  const [status, setStatus] = useState("");
  const [orderThankYou, setOrderThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCooldownUntil, setSubmitCooldownUntil] = useState(0);
  const lastAttemptRef = useRef(0);
  const formReadyAtRef = useRef(Date.now());

  useEffect(() => {
    formReadyAtRef.current = Date.now();
    setSpamTrap("");
  }, []);

  useEffect(() => {
    if (preselectedItemId) {
      setItemId(preselectedItemId);
      const product = findShopItem(preselectedItemId);
      if (product) {
        setFormData((prev) => ({
          ...prev,
          notes: prev.notes.trim()
            ? prev.notes
            : `I'd like a custom version of: ${product.name}`,
        }));
      }
    }
  }, [preselectedItemId]);

  useEffect(() => {
    if (!submitCooldownUntil) return undefined;
    const id = window.setInterval(() => {
      if (Date.now() >= submitCooldownUntil) {
        setSubmitCooldownUntil(0);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [submitCooldownUntil]);

  const selectedItem = itemId ? findShopItem(itemId) : null;
  const submitDisabled =
    isSubmitting ||
    (submitCooldownUntil > 0 && Date.now() < submitCooldownUntil);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setOrderThankYou(false);

    if (spamTrap.trim() !== "") {
      setStatus("Message could not be sent. Please try again later.");
      return;
    }

    if (!itemId) {
      setStatus("Please choose an item from the list.");
      return;
    }

    const now = Date.now();
    if (submitCooldownUntil > 0 && now < submitCooldownUntil) {
      const sec = Math.ceil((submitCooldownUntil - now) / 1000);
      setStatus(
        `You recently sent an order. Please wait ${sec} second${sec === 1 ? "" : "s"} before sending another.`,
      );
      return;
    }

    if (now - formReadyAtRef.current < CUSTOM_ORDER_MIN_FORM_AGE_MS) {
      setStatus("Please take a moment to fill out the form before submitting.");
      return;
    }

    if (
      lastAttemptRef.current > 0 &&
      now - lastAttemptRef.current < CUSTOM_ORDER_MIN_INTERVAL_MS
    ) {
      setStatus("Please wait a few seconds between send attempts.");
      return;
    }

    if (isSubmitting) return;

    lastAttemptRef.current = now;
    setIsSubmitting(true);
    setStatus("Submitting...");

    const itemLabel =
      itemId === FULLY_CUSTOM_VALUE
        ? "Fully custom / something else"
        : selectedItem
          ? `${selectedItem.name} (${selectedItem.price}) — ${selectedItem.category}`
          : itemId;

    try {
      const response = await fetch(FORMSPREE_CUSTOM_ORDER_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          notes: formData.notes.trim(),
          item_type: itemLabel,
          product_type: selectedItem?.category ?? "Custom",
          _subject: "Bryonna's Crochet Nook — Custom order request",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const fromErrors = Array.isArray(result.errors)
          ? result.errors
              .map((e) => (typeof e === "string" ? e : e?.message))
              .filter(Boolean)
              .join(" ")
          : "";
        throw new Error(
          (typeof result.error === "string" && result.error) ||
            fromErrors ||
            "Something went wrong. Please try again.",
        );
      }
      setSubmitCooldownUntil(Date.now() + CUSTOM_ORDER_SUCCESS_COOLDOWN_MS);
      setSpamTrap("");
      setStatus("");
      setOrderThankYou(true);
      setFormData({ name: "", email: "", notes: "" });
      setItemId("");
    } catch (error) {
      setOrderThankYou(false);
      setStatus(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="custom-order-page" className="content content--subpage co-page">
      <div className="co-page__glow" aria-hidden />
      <div className="co-page__inner">
        <header className="co-page__intro">
          <p className="co-page__eyebrow">Bryonna&apos;s Crochet Nook</p>
          <h1 className="co-page__title">
            Custom <span className="co-page__title-accent">Orders</span>
          </h1>
          <p className="co-page__lede">
            Pick an item from the shop list, tell us what you&apos;d like
            changed, and we&apos;ll email you to finish the details. No payment
            on this site.
          </p>
        </header>

        <form id="custom-form" className="co-panel" onSubmit={onSubmit}>
          <div className="order-form-hp" aria-hidden="true">
            <label htmlFor="custom-order-hp">Company</label>
            <input
              id="custom-order-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={spamTrap}
              onChange={(e) => setSpamTrap(e.target.value)}
            />
          </div>

          <div className="co-field">
            <label htmlFor="co-name">
              Name <span className="co-req">required</span>
            </label>
            <input
              id="co-name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </div>

          <div className="co-field">
            <label htmlFor="co-email">
              Email <span className="co-req">required</span>
            </label>
            <input
              id="co-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder="you@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="co-field">
            <label htmlFor="co-item">
              What would you like? <span className="co-req">required</span>
            </label>
            <div className="co-select-wrap">
              <select
                id="co-item"
                name="item"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select an item…
                </option>
                {ITEM_GROUPS.map((group) => (
                  <optgroup key={group.category} label={group.category}>
                    {group.items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} — {item.price}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <optgroup label="Other">
                  <option value={FULLY_CUSTOM_VALUE}>
                    Something else / fully custom
                  </option>
                </optgroup>
              </select>
            </div>
            {selectedItem ? (
              <div className="co-item-preview">
                {selectedItem.image ? (
                  <img
                    src={selectedItem.image}
                    alt=""
                    className="co-item-preview__img"
                    decoding="async"
                  />
                ) : (
                  <span className="co-item-preview__img co-item-preview__img--empty" aria-hidden>
                    No photo yet
                  </span>
                )}
                <div className="co-item-preview__meta">
                  <p className="co-item-preview__cat">{selectedItem.category}</p>
                  <p className="co-item-preview__name">{selectedItem.name}</p>
                  <p className="co-item-preview__price">{selectedItem.price}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="co-field">
            <label htmlFor="co-notes">
              Details <span className="co-opt">optional</span>
            </label>
            <textarea
              id="co-notes"
              name="notes"
              value={formData.notes}
              onChange={onChange}
              placeholder="Colors, size, charms, deadline, or anything else we should know"
              rows={5}
            />
          </div>

          <p className="co-lead-note">
            Custom pieces can take up to two weeks to make. This is a
            solo-owned business, so a little patience means a lot. Every order
            is made by hand with careful attention to detail and genuine care.
          </p>

          <button type="submit" className="co-submit" disabled={submitDisabled}>
            {isSubmitting ? (
              "Sending with love…"
            ) : (
              <>
                <span className="co-submit__heart" aria-hidden>
                  ♡
                </span>
                Request My Custom Piece
                <span className="co-submit__heart" aria-hidden>
                  ♡
                </span>
              </>
            )}
          </button>

          {orderThankYou ? (
            <div className="co-success" role="status" aria-live="polite">
              <p className="co-success__title">Thank you for your request.</p>
              <p>
                We&apos;ve received your custom order. You&apos;ll get a
                follow-up email with next steps, including pricing. No payment
                was taken on this site.
              </p>
            </div>
          ) : null}
          {status ? <p className="co-status">{status}</p> : null}
        </form>
      </div>
    </main>
  );
}
