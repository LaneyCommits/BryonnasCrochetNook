import { useEffect, useState } from "react";
import CartDrawer from "./components/CartDrawer";
import CustomOrderPage from "./components/CustomOrderPage";
import HeroSlideshow from "./components/HeroSlideshow";
import ProductModal from "./components/ProductModal";
import {
  SHOP_CATEGORIES,
  SHOP_ITEMS,
  collections,
} from "./shopCatalog";

/** Formspree form — notifications go to the address set in the Formspree dashboard. */
const FORMSPREE_CUSTOM_ORDER_URL = "https://formspree.io/f/xgolykoe";
const CART_STORAGE_KEY = "bcn-shop-cart-v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line) => line && typeof line.id === "string")
      .map((line) => ({
        id: line.id,
        qty: Math.max(1, Number(line.qty) || 1),
      }));
  } catch {
    return [];
  }
}

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

const ABOUT_HERO_IMAGE = "/bcnimg/photos/people/BryonnaStandPicWithHer.jpeg";

/** Static About hero copy (single photo — no carousel). */
const ABOUT_HERO_COPY = {
  title: "Spring Handmade Market",
  caption: "Raleigh, NC · April 2026",
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customOrderItemId, setCustomOrderItemId] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(loadCart);
  const [cartStatus, setCartStatus] = useState("");
  const [cartThankYou, setCartThankYou] = useState(false);
  const [cartSubmitting, setCartSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activePage !== "shop") setCartOpen(false);
  }, [activePage]);

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...prev, { id: item.id, qty: 1 }];
    });
    setCartThankYou(false);
    setCartStatus("");
    setCartOpen(true);
    setSelectedProduct(null);
  };

  const updateCartQty = (id, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((line) => line.id !== id);
      return prev.map((line) => (line.id === id ? { ...line, qty } : line));
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((line) => line.id !== id));
  };

  const submitCartOrder = async ({ name, email, notes, lines }) => {
    if (!lines.length) {
      setCartStatus("Add at least one item to your cart.");
      return;
    }
    setCartSubmitting(true);
    setCartStatus("Submitting...");
    setCartThankYou(false);

    const cartSummary = lines
      .map(
        ({ qty, product }) =>
          `${qty}× ${product.name} (${product.price}) [${product.category}]`,
      )
      .join("\n");

    try {
      const response = await fetch(FORMSPREE_CUSTOM_ORDER_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          notes,
          cart_items: cartSummary,
          item_type: lines.map(({ product }) => product.name).join(", "),
          _subject: "Bryonna's Crochet Nook — Shop cart order request",
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
      setCart([]);
      setCartStatus("");
      setCartThankYou(true);
    } catch (error) {
      setCartThankYou(false);
      setCartStatus(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setCartSubmitting(false);
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
      customorder: "#/customorder",
    };
    window.location.hash = hashByPage[page] ?? "#/";
  };

  const goToCustomOrderForm = (productInterest) => {
    closeMenu();
    setSelectedProduct(null);
    setCartOpen(false);
    setCustomOrderItemId(productInterest?.id ?? "");
    goToPage("customorder");
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
      else if (hash === "#/customorder") setActivePage("customorder");
      else setActivePage("home");
    };
    syncPageFromHash();
    window.addEventListener("hashchange", syncPageFromHash);
    return () => window.removeEventListener("hashchange", syncPageFromHash);
  }, []);

  const filteredShopItems = (
    activeCategory === "All"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((item) => item.category === activeCategory)
  )
    .slice()
    .sort((a, b) => {
      const aHasPic = a.images.length > 0 ? 0 : 1;
      const bHasPic = b.images.length > 0 ? 0 : 1;
      return aHasPic - bHasPic;
    });

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

        <div className="nav-actions">
          <button
            type="button"
            className={`cta-btn nav-cta${
              activePage === "customorder" ? " cta-btn--active" : ""
            }`}
            onClick={() => goToCustomOrderForm()}
          >
            <span className="cta-btn__heart" aria-hidden>
              ♡
            </span>
            Custom Order
            <span className="cta-btn__heart" aria-hidden>
              ♡
            </span>
          </button>
          {activePage === "shop" ? (
            <button
              type="button"
              className="icon-btn cart-btn"
              title="Add pieces from the shop to your cart, then send an order request"
              aria-label={
                cartCount > 0
                  ? `Open cart, ${cartCount} items. Add pieces from the shop, then send an order request`
                  : "Open cart. Add pieces from the shop to your cart, then send an order request"
              }
              onClick={() => {
                setCartThankYou(false);
                setCartOpen(true);
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26l.03.01L19.5 12c.75-.14 1.25-.9 1.1-1.65l-1.4-6.36A1.75 1.75 0 0 0 17.5 2.5H5.21L4.77 1H1v2h2l3.6 7.59-1.35 2.44C4.52 14.37 5.48 16 7 16h12v-2H7.42c-.14 0-.25-.11-.26-.24z"
                />
              </svg>
              {cartCount > 0 ? (
                <span className="cart-btn__badge">{cartCount}</span>
              ) : null}
            </button>
          ) : null}
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
          href="#/customorder"
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
            <HeroSlideshow
              onShopClick={() => {
                setActiveCategory("All");
                goToPage("shop");
              }}
            />
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
                      onClick={() =>
                        openCollectionInShop(collection.shopCategory)
                      }
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

              <section
                className="home-custom-cta"
                aria-labelledby="home-custom-cta-title"
              >
                <div className="home-custom-cta__media">
                  <img
                    src="/bcnimg/photos/plush/BunnyWithHeart.jpeg"
                    alt="White crochet bunny holding a heart"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="home-custom-cta__copy">
                  <h2 id="home-custom-cta-title">
                    Want to make a custom order?
                  </h2>
                  <p>
                    Pick a piece from the shop list or dream something new, and
                    we&apos;ll stitch it just for you.
                  </p>
                  <button
                    type="button"
                    className="cta-btn home-custom-cta__btn"
                    onClick={() => goToCustomOrderForm()}
                  >
                    <span className="cta-btn__heart" aria-hidden>
                      ♡
                    </span>
                    Custom Order
                    <span className="cta-btn__heart" aria-hidden>
                      ♡
                    </span>
                  </button>
                </div>
              </section>
            </div>
          </main>
        </>
      ) : null}

      {activePage === "customorder" ? (
        <CustomOrderPage
          key={customOrderItemId || "custom-order"}
          preselectedItemId={customOrderItemId}
        />
      ) : null}

      {activePage === "shop" ? (
        <main id="shop-page" className="content content--subpage">
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
                <button
                  key={item.id}
                  type="button"
                  className="card card--blue card--product"
                  onClick={() => setSelectedProduct(item)}
                  aria-label={`View ${item.name}, ${item.price}`}
                >
                  <div className="card-avatar">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="card-avatar__empty" aria-hidden>
                        No photo yet
                      </span>
                    )}
                    {item.images.length > 1 ? (
                      <span className="card-photo-count" aria-hidden>
                        {item.images.length} photos
                      </span>
                    ) : null}
                  </div>
                  <h3>{item.name}</h3>
                  <span className="card-heart">{item.price}</span>
                </button>
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
                      <span className="hero-title-hand">My</span>
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

      <ProductModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onCustomOrder={goToCustomOrderForm}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
        onSubmitOrder={submitCartOrder}
        submitting={cartSubmitting}
        status={cartStatus}
        thankYou={cartThankYou}
      />
    </div>
  );
}

export default App;
