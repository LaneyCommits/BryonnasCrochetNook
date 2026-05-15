import { useEffect, useState } from "react";
import HeroSlideshow from "./components/HeroSlideshow";

/** Formspree form — notifications go to the address set in the Formspree dashboard. */
const FORMSPREE_CUSTOM_ORDER_URL = "https://formspree.io/f/xgolykoe";

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

const FEATURE_ITEMS = [
  {
    icon: "/bcnimg/featureicons/feature-01-handmade.png",
    iconWidth: 182,
    iconHeight: 121,
    title: "Handmade with Love",
    description: "Every item is crafted with care and attention.",
  },
  {
    icon: "/bcnimg/featureicons/feature-04-heart-made.png",
    iconWidth: 182,
    iconHeight: 116,
    title: "Small-Batch Creations",
    description:
      "Unique, limited pieces you won't find anywhere else.",
  },
  {
    icon: "/bcnimg/featureicons/feature-03-gift.png",
    iconWidth: 182,
    iconHeight: 116,
    title: "Perfect for Gifting",
    description: "Cozy, thoughtful gifts for any occasion.",
  },
  {
    icon: "/bcnimg/featureicons/feature-02-eco-leaf.png",
    iconWidth: 140,
    iconHeight: 121,
    title: "Soft, Cozy & Durable",
    description: "Made with quality yarns made to last.",
  },
];

const collections = [
  {
    name: "Plushies",
    tone: "green",
    image: "/bcnimg/bcnrounded/roundedfrog.jpeg",
  },
  {
    name: "Wearables",
    tone: "blue",
    image: "/bcnimg/bcnrounded/roundedbeanie.jpeg",
    avatarObjectPosition: "58% 40%",
    avatarImageScale: 1.24,
  },
  {
    name: "Accessories",
    tone: "green",
    image: "/bcnimg/bcnrounded/roundedsunflower.jpeg",
  },
  {
    name: "Bracelets",
    tone: "blue",
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

const ABOUT_EVENTS = [
  {
    id: "evt-1",
    title: "Spring Handmade Market",
    caption: "Raleigh, NC · April 2026",
    image: "/bcnimg/bcnhero/bcnbunnyhero.png",
  },
  {
    id: "evt-2",
    title: "Crochet & Coffee Pop-Up",
    caption: "Durham, NC · May 2026",
    image: "/bcnimg/bcnhero/bcnfroggyhero.png",
  },
  {
    id: "evt-3",
    title: "Summer Yarn Fest",
    caption: "Cary, NC · June 2026",
    image: "/bcnimg/bcnhero/bcngummyhero.png",
  },
];

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
  const [aboutSlide, setAboutSlide] = useState(0);
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

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7609/ingest/93fcef51-dcf2-4ada-a8a8-820a8696631c", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "e1672a",
      },
      body: JSON.stringify({
        sessionId: "e1672a",
        runId: "deploy-sync",
        hypothesisId: "H-PAGES",
        location: "App.jsx:mount",
        message: "Client boot context",
        data: {
          baseUrl: import.meta.env.BASE_URL,
          href: window.location.href,
          pathname: window.location.pathname,
          hash: window.location.hash,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
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
    if (activePage !== "about") return undefined;
    const timer = setInterval(() => {
      setAboutSlide((i) => (i + 1) % ABOUT_EVENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activePage]);

  const filteredShopItems =
    activeCategory === "All"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((item) => item.category === activeCategory);

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
          <button type="button" className="icon-btn" aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
          </button>
          <button type="button" className="icon-btn cart-btn" aria-label="Shopping bag">
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
        <section className="features" aria-label="Highlights">
          {FEATURE_ITEMS.map((item) => (
            <article key={item.title}>
              <img
                className="feature-icon-img"
                src={item.icon}
                alt=""
                width={item.iconWidth}
                height={item.iconHeight}
                loading="lazy"
                decoding="async"
              />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <div className="shop-custom-row">
          <section id="shop" className="shop shop--compact">
            <div className="shop-header" id="wishlist">
              <h2>
                Shop Our Collection
                <SageLeafIcon flipped />
              </h2>
              <a href="#shop" className="shop-view-all">
                View All Products <span aria-hidden>→</span>
              </a>
            </div>
            <div className="cards cards--compact">
              {collections.map((collection) => (
                <div
                  key={collection.name}
                  className={`card card--${collection.tone}`}
                >
                  <div className="card-avatar">
                    <img
                      src={collection.image}
                      alt={`${collection.name} — sample photo`}
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
                </div>
              ))}
            </div>
          </section>
        </div>

        <section id="custom-order" className="custom-order">
          <div className="custom-order-row">
            <div className="custom-order-card" id="custom-orders-promo">
              <div className="custom-order-card__inner">
                <h2>
                  Custom Orders <span className="custom-heart">❤</span>
                </h2>
                <p>
                  Have something special in mind? Let&apos;s make it
                  one-of-a-kind.
                </p>
                <a href="#custom-form" className="banner-order-btn">
                  Order Yours <span aria-hidden>❤</span>
                </a>
              </div>
            </div>

            <form id="custom-form" onSubmit={onSubmit} className="order-form">
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
              <button type="submit">Order Yours</button>
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
                src="/bcnimg/bcnhero/bcnfroggyhero.png"
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
                  <p className="hero-lead">
                    <a
                      href="#/customorder"
                      className="hero-lead-link"
                      onClick={(event) => {
                        event.preventDefault();
                        goToPage("custom");
                      }}
                    >
                      Click to create a custom order
                    </a>
                  </p>
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

              <button type="submit" className="custom-submit-btn">❤ Submit Custom Order</button>
              <p className="custom-submit-note">We&apos;ll review your request and contact you soon!</p>
              {status && <p className="status">{status}</p>}
            </form>
          </section>
        </main>
      ) : null}

      {activePage === "about" ? (
        <main id="about-page" className="content content--subpage">
          <section className="hero hero--overlay hero--slideshow hero--subpage">
            <div className="hero-media">
              <img
                className="hero-photo"
                src={ABOUT_EVENTS[aboutSlide].image}
                alt=""
                decoding="async"
              />
              <div className="hero-copy-panel">
                <div className="hero-copy-stack">
                  <h1 className="hero-heading">
                    <span className="hero-title-word">
                      <span className="hero-title-hand">About</span>
                      <span className="hero-title-made">Bryonna</span>
                    </span>
                  </h1>
                  <p className="hero-lead">{ABOUT_EVENTS[aboutSlide].title}</p>
                  <p className="hero-lead-sub">{ABOUT_EVENTS[aboutSlide].caption}</p>
                </div>
              </div>
              <div className="hero-dots" role="tablist" aria-label="Event indicators">
                {ABOUT_EVENTS.map((event, index) => (
                  <button
                    key={event.id}
                    type="button"
                    role="tab"
                    aria-selected={index === aboutSlide}
                    className={`hero-dot ${index === aboutSlide ? "hero-dot--active" : ""}`}
                    onClick={() => setAboutSlide(index)}
                    aria-label={`Go to event ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="about about--full">
            <h2>Our Story</h2>
            <p>
              Bryonna&apos;s Crochet Nook brings handmade softness, thoughtful color palettes,
              and playful details to every piece. We focus on cozy designs that feel custom,
              cute, and gift-ready.
            </p>
          </section>
        </main>
      ) : null}

      <footer className="mobile-nav">
        <a href="#home" className="mobile-nav-link mobile-nav-link--active">
          <span className="mobile-nav-ico" aria-hidden>
            ⌂
          </span>
          Home
        </a>
        <a href="#shop" className="mobile-nav-link">
          <span className="mobile-nav-ico" aria-hidden>
            ▦
          </span>
          Shop
        </a>
        <a href="#wishlist" className="mobile-nav-link">
          <span className="mobile-nav-ico" aria-hidden>
            ♡
          </span>
          Favorites
        </a>
        <a href="#custom-order" className="mobile-nav-link">
          <span className="mobile-nav-ico mobile-nav-ico--cart" aria-hidden>
            <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
          </span>
          Orders
        </a>
      </footer>
    </div>
  );
}

export default App;
