import { useEffect, useRef, useState } from "react";
import HeroSlideshow from "./components/HeroSlideshow";

/** Formspree form — notifications go to the address set in the Formspree dashboard. */
const FORMSPREE_CUSTOM_ORDER_URL = "https://formspree.io/f/xgolykoe";

/** Light client-side spam / double-submit guards (Formspree also filters on their side). */
const CUSTOM_ORDER_MIN_FORM_AGE_MS = 3000;
const CUSTOM_ORDER_MIN_INTERVAL_MS = 10_000;
const CUSTOM_ORDER_SUCCESS_COOLDOWN_MS = 90_000;

function SageLeafIcon({ flipped = false }) {
  return (
    <span
      className={`shop-leaf-icon${flipped ? " shop-leaf-icon--flip" : ""}`}
      aria-hidden
    >
      <img
        src="/bcnimg/ui/sage-leaf-icon.png"
        alt=""
        width={40}
        height={40}
        className="shop-leaf-icon__img"
        decoding="async"
      />
    </span>
  );
}

const collections = [
  {
    name: "Plushies",
    tone: "green",
    shopCategory: "Plushies",
    image: "/bcnimg/bcnrounded/roundedfrog.jpeg",
  },
  {
    name: "Wearables",
    tone: "blue",
    shopCategory: "Beanies",
    image: "/bcnimg/bcnrounded/roundedbeanie.jpeg",
    avatarObjectPosition: "58% 40%",
    avatarImageScale: 1.24,
  },
  {
    name: "Accessories",
    tone: "green",
    shopCategory: "Headbands",
    image: "/bcnimg/bcnrounded/roundedsunflower.jpeg",
  },
  {
    name: "Bracelets",
    tone: "blue",
    shopCategory: "Bracelets",
    image: "/bcnimg/bcnrounded/roundedbracelet.png",
    avatarObjectPosition: "50% 45%",
    avatarImageScale: 1.12,
  },
];

const SHOP_CATEGORIES = [
  "All",
  "Plushies",
  "Headbands",
  "Beanies",
  "Bracelets",
  "Keychains",
];

const SHOP_ITEMS = [
  {
    id: "shop-1",
    name: "Bunny Buddy",
    category: "Plushies",
    image: "/bcnimg/bcnrounded/roundedbunny.jpeg",
    price: "$28",
  },
  {
    id: "shop-2",
    name: "Frog Friend",
    category: "Plushies",
    image: "/bcnimg/bcnrounded/roundedfrog.jpeg",
    price: "$24",
  },
  {
    id: "shop-3",
    name: "Cozy Bow Band",
    category: "Headbands",
    image: "/bcnimg/bcnrounded/roundedsunflower.jpeg",
    price: "$14",
  },
  {
    id: "shop-4",
    name: "Cloud Beanie",
    category: "Beanies",
    image: "/bcnimg/bcnrounded/roundedbeanie.jpeg",
    price: "$22",
  },
  {
    id: "shop-5",
    name: "Sunset Bracelet",
    category: "Bracelets",
    image: "/bcnimg/bcnrounded/roundedbracelet.png",
    price: "$12",
  },
  {
    id: "shop-6",
    name: "Mini Charm Keychain",
    category: "Keychains",
    image: "/bcnimg/bcnrounded/roundedfrog.jpeg",
    price: "$10",
  },
];

const ABOUT_HERO_IMAGE = "/bcnimg/photos/people/BryonnaStandPicWithHer.jpeg";

/** Static About hero copy (single photo — no carousel). */
const ABOUT_HERO_COPY = {
  title: "Spring Handmade Market",
  caption: "Raleigh, NC · April 2026",
};

const PRODUCT_TYPE_CHOICES = [
  { id: "tote-bag", label: "Tote Bag", icon: "👜" },
  { id: "pouch", label: "Pouch", icon: "🎀" },
  { id: "keychain", label: "Keychain", icon: "🩵" },
  { id: "sticker", label: "Sticker", icon: "🌸" },
  { id: "plushie", label: "Plushie", icon: "🧸" },
  { id: "other", label: "Other", icon: "🎗️" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [formData, setFormData] = useState({
    name: "",
    item_type: "",
    notes: "",
    first_name: "",
    last_name: "",
    email: "",
    details: "",
    product_type: "",
    quantity: "1",
    preferred_date: "",
    additional_notes: "",
  });
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [spamTrap, setSpamTrap] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCooldownUntil, setSubmitCooldownUntil] = useState(0);
  const lastAttemptRef = useRef(0);
  const formReadyAtRef = useRef(Date.now());

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (spamTrap.trim() !== "") {
      setStatus("Message could not be sent. Please try again later.");
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

    try {
      const response = await fetch(FORMSPREE_CUSTOM_ORDER_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          reference_files: referenceFiles.map((file) => file.name),
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
      setStatus("Order submitted! We will contact you soon.");
      setFormData({
        name: "",
        item_type: "",
        notes: "",
        first_name: "",
        last_name: "",
        email: "",
        details: "",
        product_type: "",
        quantity: "1",
        preferred_date: "",
        additional_notes: "",
      });
      setReferenceFiles([]);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);
  const goToPage = (page) => {
    setActivePage(page);
    closeMenu();
    const hashByPage = {
      home: "#/",
      shop: "#/shop",
      about: "#/about",
      custom: "#/customorder",
    };
    window.location.hash = hashByPage[page] ?? "#/";
  };

  const openCollectionInShop = (category) => {
    setActiveCategory(category);
    goToPage("shop");
  };

  useEffect(() => {
    const syncPageFromHash = () => {
      const hash = window.location.hash || "#/";
      if (hash === "#/shop") setActivePage("shop");
      else if (hash === "#/about") setActivePage("about");
      else if (hash === "#/customorder") setActivePage("custom");
      else setActivePage("home");
    };
    syncPageFromHash();
    window.addEventListener("hashchange", syncPageFromHash);
    return () => window.removeEventListener("hashchange", syncPageFromHash);
  }, []);

  useEffect(() => {
    if (activePage !== "home" && activePage !== "custom") return undefined;
    formReadyAtRef.current = Date.now();
    setSpamTrap("");
    return undefined;
  }, [activePage]);

  useEffect(() => {
    if (!submitCooldownUntil) return undefined;
    const id = window.setInterval(() => {
      if (Date.now() >= submitCooldownUntil) {
        setSubmitCooldownUntil(0);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [submitCooldownUntil]);

  const filteredShopItems =
    activeCategory === "All"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((item) => item.category === activeCategory);

  const submitDisabled =
    isSubmitting ||
    (submitCooldownUntil > 0 && Date.now() < submitCooldownUntil);

  const onFileChange = (event) => {
    const files = Array.from(event.target.files ?? []);
    setReferenceFiles(files.slice(0, 3));
  };

  return (
    <div className="page">
      <header className="top-nav">
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>

        <a
          href="#home"
          className="brand-lockup"
          onClick={(event) => {
            event.preventDefault();
            goToPage("home");
          }}
        >
          <span className="brand-mark" aria-hidden />
          <span className="brand-text">
            <span className="brand-script">Bryonna&apos;s</span>
            <span className="brand-block">
              CROCHET NOOK <span className="brand-heart">❤</span>
            </span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Main">
          <a
            href="#home"
            className={activePage === "home" ? "desktop-nav-link--active" : ""}
            onClick={(event) => {
              event.preventDefault();
              goToPage("home");
            }}
          >
            Home
          </a>
          <a
            href="#shop-page"
            className={activePage === "shop" ? "desktop-nav-link--active" : ""}
            onClick={(event) => {
              event.preventDefault();
              goToPage("shop");
            }}
          >
            Shop
          </a>
          <a
            href="#about-page"
            className={activePage === "about" ? "desktop-nav-link--active" : ""}
            onClick={(event) => {
              event.preventDefault();
              goToPage("about");
            }}
          >
            About
          </a>
        </nav>

        <button
          type="button"
          className="cta-btn desktop-cta"
          onClick={() => goToPage("custom")}
        >
          Custom Order
        </button>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn cart-btn"
            aria-label="Shop"
            onClick={() => goToPage("shop")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2h2V8h8v2h2V8h2v12z"
              />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="drawer-backdrop"
          onClick={closeMenu}
          role="presentation"
        />
      ) : null}
      <nav
        id="mobile-drawer"
        className={`mobile-drawer ${menuOpen ? "mobile-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            goToPage("home");
          }}
        >
          Home
        </a>
        <a
          href="#shop-page"
          onClick={(event) => {
            event.preventDefault();
            goToPage("shop");
          }}
        >
          Shop
        </a>
        <a
          href="#about-page"
          onClick={(event) => {
            event.preventDefault();
            goToPage("about");
          }}
        >
          About
        </a>
      </nav>

      {activePage === "home" ? (
        <>
          <div className="hero-wrap">
            <HeroSlideshow />
          </div>

          <main className="content">
        <div className="shop-custom-row">
          <section id="shop" className="shop shop--compact">
            <div className="shop-header" id="wishlist">
              <h2>
                Shop Our Collection
                <SageLeafIcon flipped />
              </h2>
              <a
                href="#/shop"
                className="shop-view-all"
                onClick={(event) => {
                  event.preventDefault();
                  setActiveCategory("All");
                  goToPage("shop");
                }}
              >
                View All Products <span aria-hidden>→</span>
              </a>
            </div>
            <div className="cards cards--compact">
              {collections.map((collection) => (
                <button
                  key={collection.name}
                  type="button"
                  className={`card card--${collection.tone}`}
                  onClick={() => openCollectionInShop(collection.shopCategory)}
                  aria-label={`Shop ${collection.name}`}
                >
                  <div className="card-avatar">
                    <img
                      src={collection.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{
                        ...(collection.avatarObjectPosition && {
                          objectPosition: collection.avatarObjectPosition,
                        }),
                        ...(collection.avatarImageScale != null && {
                          transform: `scale(${collection.avatarImageScale})`,
                          transformOrigin: "center center",
                        }),
                      }}
                    />
                  </div>
                  <h3>{collection.name}</h3>
                  <span className="card-heart" aria-hidden>
                    ♥
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section id="custom-order" className="custom-order">
          <div className="custom-order-row">
            <form id="custom-form" onSubmit={onSubmit} className="order-form">
              <h2 className="order-form__heading">
                Custom Orders <span className="custom-heart">❤</span>
              </h2>
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
              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Your name"
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Email address"
                required
              />
              <input
                name="item_type"
                value={formData.item_type}
                onChange={onChange}
                placeholder="Item type (e.g., bunny plush)"
                required
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={onChange}
                placeholder="Describe colors, size, and details"
                rows={4}
              />
              <button type="submit" disabled={submitDisabled}>
                Order Yours
              </button>
              {status && <p className="status">{status}</p>}
            </form>
          </div>
        </section>
          </main>
        </>
      ) : null}

      {activePage === "shop" ? (
        <main id="shop-page" className="content content--subpage">
          <section className="hero hero--overlay hero--slideshow hero--subpage">
            <div className="hero-media">
              <img
                className="hero-photo"
                src="/bcnimg/bcnhero/bcndinohero.png"
                alt=""
                decoding="async"
              />
              <div className="hero-copy-panel">
                <div className="hero-copy-stack">
                  <h1 className="hero-heading">
                    <span className="hero-title-word">
                      <span className="hero-title-hand">The</span>
                      <span className="hero-title-made">Nook</span>
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </section>

          <section className="shop shop--compact">
            <div className="shop-header">
              <h2>
                <SageLeafIcon />
                Shop Categories
                <SageLeafIcon flipped />
              </h2>
            </div>
            <div className="shop-cats">
              {SHOP_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`shop-cat-btn ${activeCategory === category ? "shop-cat-btn--active" : ""}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="cards cards--compact">
              {filteredShopItems.map((item) => (
                <article key={item.id} className="card card--blue">
                  <div className="card-avatar">
                    <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                  </div>
                  <h3>{item.name}</h3>
                  <span className="card-heart">{item.price}</span>
                </article>
              ))}
            </div>
          </section>
        </main>
      ) : null}

      {activePage === "custom" ? (
        <main id="custom-page" className="content content--subpage customorder-page">
          <section id="custom-order" className="custom-order custom-order--page-shell">
            <form id="custom-form" onSubmit={onSubmit} className="order-form order-form--custom-page">
              <h1 className="custom-form-title">Custom Order</h1>
              <p className="custom-helper">
                Tell us what you have in mind and we&apos;ll create something special just for you!
              </p>

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

              <section className="custom-step">
                <h2 className="custom-step-title">
                  <span className="custom-step-num">1</span>
                  Product Type
                </h2>
                <p className="custom-step-sub">What would you like us to create?</p>
                <fieldset className="custom-product-grid">
                  {PRODUCT_TYPE_CHOICES.map((choice) => (
                    <label key={choice.id} className="custom-product-card">
                      <input
                        type="radio"
                        name="product_type"
                        value={choice.label}
                        checked={formData.product_type === choice.label}
                        onChange={onChange}
                        required
                      />
                      <span className="custom-product-icon" aria-hidden>
                        {choice.icon}
                      </span>
                      <span>{choice.label}</span>
                    </label>
                  ))}
                </fieldset>
              </section>

              <section className="custom-step">
                <h2 className="custom-step-title">
                  <span className="custom-step-num">2</span>
                  Details
                </h2>
                <p className="custom-step-sub">Please describe your idea in as much detail as possible.</p>
                <textarea
                  id="custom-details"
                  name="details"
                  value={formData.details}
                  onChange={onChange}
                  placeholder="e.g. size, color, design, theme, text, inspiration, etc."
                  rows={4}
                  required
                />
              </section>

              <section className="custom-step">
                <h2 className="custom-step-title">
                  <span className="custom-step-num">3</span>
                  References <small>(Optional)</small>
                </h2>
                <p className="custom-step-sub">Upload any images or references to help us understand your idea.</p>
                <label htmlFor="custom-references" className="custom-upload-box">
                  <span className="custom-upload-icon" aria-hidden>
                    ☁️
                  </span>
                  <span>Click to upload or drag and drop</span>
                  <small>PNG, JPG up to 5MB each</small>
                </label>
                <input
                  id="custom-references"
                  type="file"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  multiple
                  onChange={onFileChange}
                  className="custom-file-input"
                />
                {referenceFiles.length > 0 ? (
                  <p className="custom-file-list">
                    {referenceFiles.map((file) => file.name).join(", ")}
                  </p>
                ) : null}
              </section>

              <section className="custom-step custom-two-col">
                <div>
                  <h2 className="custom-step-title">
                    <span className="custom-step-num">4</span>
                    Quantity
                  </h2>
                  <p className="custom-step-sub">How many would you like to order?</p>
                  <select name="quantity" value={formData.quantity} onChange={onChange}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <h2 className="custom-step-title">
                    <span className="custom-step-num">5</span>
                    Preferred Date <small>(Optional)</small>
                  </h2>
                  <p className="custom-step-sub">When do you need it by?</p>
                  <input
                    type="date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={onChange}
                  />
                </div>
              </section>

              <section className="custom-step">
                <h2 className="custom-step-title">
                  <span className="custom-step-num">6</span>
                  Your Contact Information
                </h2>
                <p className="custom-step-sub">We&apos;ll use this to get back to you about your order.</p>
                <div className="custom-contact-grid">
                  <div>
                    <label className="custom-label" htmlFor="first-name">
                      Name
                    </label>
                    <input
                      id="first-name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={onChange}
                      placeholder="Your name"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div>
                    <label className="custom-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={onChange}
                      placeholder="youremail@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div className="custom-extra-notes">
                  <label className="custom-label" htmlFor="additional-notes">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="additional-notes"
                    name="additional_notes"
                    value={formData.additional_notes}
                    onChange={onChange}
                    rows={3}
                    placeholder="Any other information you'd like to add?"
                  />
                </div>
              </section>

              <button
                type="submit"
                className="custom-submit-btn"
                disabled={submitDisabled}
              >
                ❤ Submit Custom Order
              </button>
              <p className="custom-submit-note">We&apos;ll review your request and contact you soon!</p>
              {status && <p className="status">{status}</p>}
            </form>
          </section>
        </main>
      ) : null}

      {activePage === "about" ? (
        <main id="about-page" className="content content--subpage">
          <section className="hero hero--overlay hero--slideshow hero--subpage hero--about">
            <div className="hero-media">
              <img
                className="hero-photo"
                src={ABOUT_HERO_IMAGE}
                alt="Bryonna at her crochet booth with handmade pieces on display."
                decoding="async"
              />
              <div className="hero-copy-panel">
                <div className="hero-copy-stack">
                  <h1 className="hero-heading">
                    <span className="hero-title-word">
                      <span className="hero-title-hand">Our</span>
                      <span className="hero-title-made">Story</span>
                    </span>
                  </h1>
                  <p className="hero-lead">{ABOUT_HERO_COPY.title}</p>
                  <p className="hero-lead-sub">{ABOUT_HERO_COPY.caption}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="about about--full">
            <p>Coming soon&hellip;</p>
          </section>
        </main>
      ) : null}
    </div>
  );
}

export default App;
