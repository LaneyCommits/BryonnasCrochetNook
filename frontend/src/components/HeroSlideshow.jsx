import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 5500;

/** Paths match `public/bcnimg/bcnhero/` (source: `bcnimg/bcnhero/`). */
export const HERO_IMAGE_URLS = [
  "/bcnimg/bcnhero/bcnbunnyhero.png",
  "/bcnimg/bcnhero/bcnfroggyhero.png",
  "/bcnimg/bcnhero/bcngummyhero.png",
];

export default function HeroSlideshow({ images = HERO_IMAGE_URLS }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section
      id="home"
      className="hero hero--overlay hero--slideshow"
      aria-roledescription="carousel"
      aria-label="Featured crochet photos"
    >
      <div className="hero-media">
        <div className="hero-slides" aria-live="polite">
          <img
            key={images[index]}
            className="hero-photo"
            src={images[index]}
            alt=""
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <div className="hero-copy-panel">
          <div className="hero-copy-stack">
            <h1 className="hero-heading">
              <span className="hero-title-word">
                <span className="hero-title-hand">Hand</span>
                <span className="hero-title-made">made</span>
              </span>
            </h1>
            <p className="hero-lead">One Stitch at a Time</p>
            <p className="hero-lead-sub">Crochet Creations for You</p>
          </div>
          <a href="#shop" className="hero-shop-btn">
            Shop Now <span aria-hidden>→</span>
          </a>
        </div>

        <div className="hero-dots" role="tablist" aria-label="Slide indicators">
          {images.map((_, i) => (
            <button
              key={String(i)}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`hero-dot ${i === index ? "hero-dot--active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
