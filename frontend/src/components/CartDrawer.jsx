import { useEffect, useId, useState } from "react";
import { findShopItem } from "../shopCatalog";

export default function CartDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemove,
  onSubmitOrder,
  submitting,
  status,
  thankYou,
}) {
  const titleId = useId();
  const [form, setForm] = useState({ name: "", email: "", notes: "" });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (thankYou) {
      setForm({ name: "", email: "", notes: "" });
    }
  }, [thankYou]);

  if (!open) return null;

  const lines = items
    .map((line) => {
      const product = findShopItem(line.id);
      if (!product) return null;
      return { ...line, product };
    })
    .filter(Boolean);

  const totalCount = lines.reduce((sum, line) => sum + line.qty, 0);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitOrder({
      name: form.name.trim(),
      email: form.email.trim(),
      notes: form.notes.trim(),
      lines,
    });
  };

  return (
    <div className="cart-drawer-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="cart-drawer__header">
          <h2 id={titleId}>Your Cart</h2>
          <button
            type="button"
            className="cart-drawer__close"
            aria-label="Close cart"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <p className="cart-drawer__note">
          Add pieces from the shop to your cart, then send an order request.
          We will email you to finish everything. No payment is taken on this
          site.
        </p>

        {lines.length === 0 ? (
          <p className="cart-drawer__empty">
            Your cart is waiting. Explore the shop, add what you love, then
            send your order request here.
          </p>
        ) : (
          <ul className="cart-drawer__list">
            {lines.map(({ id, qty, product }) => (
              <li key={id} className="cart-drawer__line">
                {product.image ? (
                  <img
                    src={product.image}
                    alt=""
                    className="cart-drawer__thumb"
                    decoding="async"
                  />
                ) : (
                  <span className="cart-drawer__thumb cart-drawer__thumb--empty" aria-hidden>
                    No photo
                  </span>
                )}
                <div className="cart-drawer__meta">
                  <p className="cart-drawer__name">{product.name}</p>
                  <p className="cart-drawer__price">{product.price}</p>
                  <div className="cart-drawer__qty">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${product.name}`}
                      onClick={() => onUpdateQty(id, qty - 1)}
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${product.name}`}
                      onClick={() => onUpdateQty(id, qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="cart-drawer__remove"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => onRemove(id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {thankYou ? (
          <div className="cart-drawer__success" role="status" aria-live="polite">
            <p className="cart-drawer__success-title">Request received</p>
            <p>
              Thanks! We&apos;ll email you with next steps to finish your order
              — including payment details. No charge was taken on this site.
            </p>
          </div>
        ) : (
          <form className="cart-drawer__form" onSubmit={handleSubmit}>
            <h3 className="cart-drawer__form-title">
              Request order{totalCount > 0 ? ` (${totalCount})` : ""}
            </h3>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              required
              disabled={lines.length === 0 || submitting}
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email address"
              required
              disabled={lines.length === 0 || submitting}
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              placeholder="Colors, sizes, or other details"
              rows={3}
              disabled={lines.length === 0 || submitting}
            />
            <button
              type="submit"
              className="cart-drawer__submit"
              disabled={lines.length === 0 || submitting}
            >
              {submitting ? "Sending…" : "Email my order request"}
            </button>
            {status ? <p className="cart-drawer__status">{status}</p> : null}
          </form>
        )}
      </aside>
    </div>
  );
}
