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

/** Home custom-order checkboxes — `label` is sent to Formspree; `short` keeps compact labels where used. */
const CUSTOM_ORDER_PRODUCT_OPTIONS = [
  {
    id: "regular-plush",
    short: "Regular plushies",
    label: "Regular-Sized Plushies (animals, food, objects, etc)",
  },
  { id: "small-plush", short: "Small plushies", label: "Small Plushies" },
  { id: "jumbo-plush", short: "Jumbo plushies", label: "Jumbo-Sized Plushies" },
  { id: "headbands", short: "Headbands", label: "Headbands" },
  { id: "scarves", short: "Scarves", label: "Scarves" },
  { id: "slipper-socks", short: "Slipper socks", label: "Slipper Socks" },
  { id: "beanies", short: "Beanies", label: "Beanies" },
  {
    id: "keychains",
    short: "Keychains",
    label: "Keychains",
  },
  { id: "lip-balm-holder", short: "Lip balm holder", label: "Lip Balm Holder" },
  { id: "cup-covers", short: "Cup covers / warmers", label: "Cup Covers/Warmers" },
  { id: "coasters", short: "Coasters", label: "Coasters" },
  { id: "thick-blankets", short: "Thick blankets", label: "Thick Blankets" },
  { id: "fluffy-blankets", short: "Fluffy blankets", label: "Fluffy Blankets" },
  {
    id: "bead-bracelets",
    short: "Glass bead bracelets",
    label: "Custom Glass Bead Bracelets",
  },
];

/** Home custom-order: tap-to-toggle color swatches (labels go to Formspree). */
const HOME_COLOR_SWATCHES = [
  { id: "white", caption: "White", label: "White / natural", hex: "#f7f4f0" },
  { id: "cream", caption: "Cream", label: "Cream", hex: "#faf0dc" },
  { id: "blush", caption: "Blush", label: "Blush pink", hex: "#f3c6d6" },
  { id: "rose", caption: "Rose", label: "Rose", hex: "#e8a4bc" },
  { id: "lavender", caption: "Lavender", label: "Lavender", hex: "#dcd6f2" },
  { id: "sky", caption: "Sky", label: "Sky blue", hex: "#c9dff5" },
  { id: "sage", caption: "Sage", label: "Sage green", hex: "#c5d9b8" },
  { id: "mint", caption: "Mint", label: "Mint", hex: "#c8f0e3" },
  { id: "butter", caption: "Butter", label: "Butter yellow", hex: "#fce9a6" },
  { id: "peach", caption: "Peach", label: "Peach", hex: "#ffd4bf" },
  { id: "tan", caption: "Tan", label: "Tan / camel", hex: "#ddc4a8" },
  { id: "chocolate", caption: "Chocolate", label: "Chocolate brown", hex: "#8b6b52" },
  { id: "charcoal", caption: "Charcoal", label: "Soft black / charcoal", hex: "#5c5652" },
  { id: "red", caption: "Red", label: "Red", hex: "#dc2626" },
  { id: "burgundy", caption: "Burgundy", label: "Burgundy", hex: "#7f1d1d" },
  { id: "coral-bright", caption: "Coral", label: "Coral", hex: "#fb7185" },
  { id: "orange", caption: "Orange", label: "Orange", hex: "#ea580c" },
  { id: "amber", caption: "Amber", label: "Amber / gold", hex: "#d97706" },
  { id: "kelly-green", caption: "Kelly", label: "Kelly green", hex: "#16a34a" },
  { id: "forest-green", caption: "Forest", label: "Forest green", hex: "#14532d" },
  { id: "teal", caption: "Teal", label: "Teal", hex: "#0f766e" },
  { id: "navy", caption: "Navy", label: "Navy", hex: "#1e3a8a" },
  { id: "royal-blue", caption: "Royal", label: "Royal blue", hex: "#2563eb" },
  { id: "purple", caption: "Purple", label: "Purple", hex: "#7c3aed" },
  { id: "magenta", caption: "Magenta", label: "Magenta", hex: "#c026d3" },
  { id: "hot-pink", caption: "Hot pink", label: "Hot pink", hex: "#db2777" },
  { id: "true-black", caption: "Black", label: "Black", hex: "#0a0a0a" },
  { id: "heather-gray", caption: "Heather", label: "Heather gray", hex: "#94a3b8" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notes: "",
  });
  const [homeOrderTypeIds, setHomeOrderTypeIds] = useState([]);
  const [homeColorIds, setHomeColorIds] = useState([]);
  const [status, setStatus] = useState("");
  const [orderThankYou, setOrderThankYou] = useState(false);
  const [spamTrap, setSpamTrap] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCooldownUntil, setSubmitCooldownUntil] = useState(0);
  const lastAttemptRef = useRef(0);
  const formReadyAtRef = useRef(Date.now());
  const pendingCustomOrderScrollRef = useRef(false);

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

    if (activePage !== "home" || homeOrderTypeIds.length === 0) {
      setStatus("Please choose at least one item type.");
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
          name: formData.name.trim(),
          email: formData.email.trim(),
          notes: formData.notes.trim(),
          item_type: homeOrderTypeIds
            .map(
              (id) =>
                CUSTOM_ORDER_PRODUCT_OPTIONS.find((o) => o.id === id)?.label ??
                id,
            )
            .join(", "),
          product_type: "",
          color_preferences: homeColorIds
            .map(
              (id) =>
                HOME_COLOR_SWATCHES.find((c) => c.id === id)?.label ?? id,
            )
            .join(", "),
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
      setFormData({
        name: "",
        email: "",
        notes: "",
      });
      setHomeOrderTypeIds([]);
      setHomeColorIds([]);
    } catch (error) {
      setOrderThankYou(false);
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
    };
    window.location.hash = hashByPage[page] ?? "#/";
  };

  const scrollToCustomOrderSection = () => {
    document.getElementById("custom-order")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const goToCustomOrderForm = () => {
    closeMenu();
    if (activePage !== "home") {
      pendingCustomOrderScrollRef.current = true;
      goToPage("home");
    } else {
      window.setTimeout(() => scrollToCustomOrderSection(), 0);
    }
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
      else if (hash === "#/customorder") {
        setActivePage("home");
        window.location.replace(
          `${window.location.pathname}${window.location.search}#/`,
        );
        window.setTimeout(() => scrollToCustomOrderSection(), 120);
      } else setActivePage("home");
    };
    syncPageFromHash();
    window.addEventListener("hashchange", syncPageFromHash);
    return () => window.removeEventListener("hashchange", syncPageFromHash);
  }, []);

  useEffect(() => {
    if (activePage !== "home") return undefined;
    formReadyAtRef.current = Date.now();
    setSpamTrap("");
    return undefined;
  }, [activePage]);

  useEffect(() => {
    if (activePage !== "home" || !pendingCustomOrderScrollRef.current) {
      return undefined;
    }
    pendingCustomOrderScrollRef.current = false;
    const id = window.setTimeout(() => scrollToCustomOrderSection(), 100);
    return () => window.clearTimeout(id);
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

  const toggleHomeOrderType = (id) => {
    setHomeOrderTypeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleHomeColor = (id) => {
    setHomeColorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
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
          onClick={goToCustomOrderForm}
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
        <a
          href="#custom-order"
          onClick={(event) => {
            event.preventDefault();
            goToCustomOrderForm();
          }}
        >
          Custom Order
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
              <fieldset className="order-form-types">
                <legend className="order-form-types__legend">What would you like?</legend>
                <div className="order-form-types__grid">
                  {CUSTOM_ORDER_PRODUCT_OPTIONS.map((opt) => (
                    <label key={opt.id} className="order-form-types__chk">
                      <input
                        type="checkbox"
                        checked={homeOrderTypeIds.includes(opt.id)}
                        onChange={() => toggleHomeOrderType(opt.id)}
                      />
                      <span className="order-form-types__text">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="order-form-colors" aria-labelledby="order-form-colors-heading">
                <div id="order-form-colors-heading" className="order-form-colors__label">
                  Colors
                </div>
                <div className="order-form-colors__row" role="group" aria-label="Color ideas">
                  {HOME_COLOR_SWATCHES.map((c) => {
                    const on = homeColorIds.includes(c.id);
                    return (
                      <div key={c.id} className="order-form-colors__item">
                        <button
                          type="button"
                          className={`order-form-colors__dot${on ? " order-form-colors__dot--selected" : ""}`}
                          style={{
                            backgroundColor: c.hex,
                          }}
                          title={c.label}
                          aria-label={c.label}
                          aria-pressed={on}
                          onClick={() => toggleHomeColor(c.id)}
                        />
                        <span className="order-form-colors__caption" aria-hidden="true">
                          {c.caption}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={onChange}
                placeholder="Add details"
                rows={4}
              />
              <button type="submit" disabled={submitDisabled}>
                Order Yours
              </button>
              {orderThankYou ? (
                <div
                  className="order-form-success"
                  role="status"
                  aria-live="polite"
                >
                  <p className="order-form-success__title">
                    Thank you for your order.
                  </p>
                  <p className="order-form-success__text">
                    We have received your request. You will receive a follow-up
                    email with pricing information and any additional details we
                    may need to move your project forward.
                  </p>
                  <p className="order-form-success__text">
                    Because every item is personalized and handmade, lead times
                    can vary. We appreciate your patience while we prepare your
                    piece with care.
                  </p>
                </div>
              ) : null}
              {status ? <p className="status">{status}</p> : null}
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
