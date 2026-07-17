/** Single home hero image for now — add more slides later as needed. */
export const HERO_SLIDES = [
  {
    id: "jumbo-turtle",
    src: "/bcnimg/photos/plush/SeaTurtleJUMBO.jpeg",
    kind: "photo",
    objectPosition: "center 40%",
  },
];

export const HERO_IMAGE_URLS = HERO_SLIDES.map((slide) => slide.src);

export default function HeroSlideshow({ slides = HERO_SLIDES, onShopClick }) {
  const active = slides[0];

  if (!active) return null;

  return (
    <section
      id="home"
      className={`hero hero--overlay hero--slideshow hero--home hero--${active.kind}`}
      aria-label="Featured crochet photo"
    >
      <div className="hero-media">
        <div className="hero-slides">
          <img
            className="hero-photo"
            src={active.src}
            alt=""
            decoding="async"
            fetchPriority="high"
            style={{ objectPosition: active.objectPosition }}
          />
        </div>

        <div className="hero-copy-panel">
          <div className="hero-copy-stack">
            <p className="hero-brand">Bryonna&apos;s Crochet Nook</p>
            <h1 className="hero-heading">
              <span className="hero-title-word">
                <span className="hero-title-hand">Hand</span>
                <span className="hero-title-made">made</span>
              </span>
            </h1>
            <p className="hero-lead">One stitch at a time</p>
          </div>
          <a
            href="#/shop"
            className="hero-shop-btn"
            onClick={(event) => {
              if (!onShopClick) return;
              event.preventDefault();
              onShopClick();
            }}
          >
            Shop Now <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
