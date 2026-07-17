import { useEffect, useId, useState } from "react";

export default function ProductModal({
  item,
  onClose,
  onAddToCart,
  onCustomOrder,
}) {
  const titleId = useId();
  const [photoIndex, setPhotoIndex] = useState(0);
  const images = item?.images?.length ? item.images : item?.image ? [item.image] : [];

  useEffect(() => {
    setPhotoIndex(0);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && images.length > 1) {
        setPhotoIndex((i) => (i + 1) % images.length);
      }
      if (event.key === "ArrowLeft" && images.length > 1) {
        setPhotoIndex((i) => (i - 1 + images.length) % images.length);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, images.length, onClose]);

  if (!item) return null;

  const hasGallery = images.length > 1;

  return (
    <div
      className="product-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="product-modal__close"
          aria-label="Close product details"
          onClick={onClose}
        >
          ×
        </button>

        <div className="product-modal__gallery">
          <div className="product-modal__main">
            {images.length > 0 ? (
              <img
                key={images[photoIndex]}
                src={images[photoIndex]}
                alt={`${item.name} photo ${photoIndex + 1}`}
                decoding="async"
              />
            ) : (
              <div className="product-modal__empty" aria-hidden>
                No photo yet
              </div>
            )}
            {hasGallery ? (
              <>
                <button
                  type="button"
                  className="product-modal__nav product-modal__nav--prev"
                  aria-label="Previous photo"
                  onClick={() =>
                    setPhotoIndex((i) => (i - 1 + images.length) % images.length)
                  }
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="product-modal__nav product-modal__nav--next"
                  aria-label="Next photo"
                  onClick={() =>
                    setPhotoIndex((i) => (i + 1) % images.length)
                  }
                >
                  ›
                </button>
              </>
            ) : null}
          </div>

          {hasGallery ? (
            <div
              className="product-modal__thumbs"
              role="tablist"
              aria-label="Product photos"
            >
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={index === photoIndex}
                  className={`product-modal__thumb${
                    index === photoIndex ? " product-modal__thumb--active" : ""
                  }`}
                  onClick={() => setPhotoIndex(index)}
                >
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-modal__info">
          <p className="product-modal__category">{item.category}</p>
          <h2 id={titleId} className="product-modal__title">
            {item.name}
          </h2>
          <p className="product-modal__price">{item.price}</p>
          {item.description ? (
            <p className="product-modal__desc">{item.description}</p>
          ) : (
            <p className="product-modal__desc">
              Handmade with care. Add this to your request cart — no payment on
              this site. We&apos;ll email you to finish the order.
            </p>
          )}

          <div className="product-modal__actions">
            <button
              type="button"
              className="product-modal__primary"
              onClick={() => {
                onAddToCart(item);
              }}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="product-modal__secondary"
              onClick={() => onCustomOrder(item)}
            >
              Custom Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
