"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import styles from "./InteriorLoopSlider.module.css";

const defaultSlides = [
  {
    image: "/assets/interior-slider/slide-1.jpg",
    title: "HELLO MARVEL!",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore",
  },
  {
    image: "/assets/interior-slider/slide-2.jpg",
    title: "HELLO MARVEL!",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore",
  },
  {
    image: "/assets/interior-slider/slide-3.jpg",
    title: "HELLO MARVEL!",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore",
  },
  {
    image: "/assets/interior-slider/slide-4.jpg",
    title: "HELLO MARVEL!",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore",
  },
];

export default function InteriorLoopSlider({
  slides = defaultSlides,
  sectionTitle,
  sectionText,
}) {
  const loopSlides = useMemo(() => {
    if (!slides.length) return [];
    if (slides.length === 1) return slides;
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides]);

  const [currentIndex, setCurrentIndex] = useState(slides.length > 1 ? 1 : 0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const goNext = () => {
    if (slides.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const goPrev = () => {
    if (slides.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (slides.length <= 1) return;

    if (currentIndex === slides.length + 1) {
      setEnableTransition(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setEnableTransition(false);
      setCurrentIndex(slides.length);
    }

    setIsAnimating(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {(sectionTitle || sectionText) && (
          <div className={styles.head}>
            {sectionTitle ? <h2>{sectionTitle}</h2> : null}
            {sectionText ? <p>{sectionText}</p> : null}
          </div>
        )}

        <div className={styles.sliderWrap}>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={goPrev}
            aria-label="Previous slide"
          >
            <span>‹</span>
          </button>

          <div className={styles.viewport}>
            <div
              className={styles.track}
              style={{
                transform: `translateX(calc(-${currentIndex} * (var(--slide-width) + var(--slide-gap))))`,
                transition: enableTransition ? "transform 480ms ease" : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {loopSlides.map((slide, index) => (
                <article className={styles.card} key={`${slide.image}-${index}`}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 768px) 86vw, 42vw"
                    />
                  </div>

                  <div className={styles.overlay}>
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={goNext}
            aria-label="Next slide"
          >
            <span>›</span>
          </button>
        </div>
      </div>
    </section>
  );
}