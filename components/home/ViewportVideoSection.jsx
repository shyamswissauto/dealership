"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ViewportVideoSection.module.css";

import "animate.css";

export default function ViewportVideoSection({
  src = "/assets/samples/sinotruk-general.mp4",
  poster = "/assets/home/home-videbg.webp",
  loop = true,
  threshold = 0.5,
  autoPlay = true, 
  className = "hmVideoSection",
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay); 
  const [loadedSrc, setLoadedSrc] = useState(false);
  const [animationClass, setAnimationClass] = useState(""); 


  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const visible = entry.isIntersecting && entry.intersectionRatio >= threshold;
          setInView(visible);


          if (visible) {
            setAnimationClass("animate__animated animate__slideInUp");
          } else {

            if (entry.boundingClientRect.top < 0) {
              setAnimationClass("animate__animated ");
            }
          }
        }
      },
      { threshold: [0, threshold, 1] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);


  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (inView && isPlaying) {
      if (!loadedSrc) {
        v.src = src; 
        setLoadedSrc(true);
      }
      v.muted = true; 
      v.play().catch(() => {}); 
    } else {
      v.pause();
    }
  }, [inView, isPlaying, loadedSrc, src]);


  const handlePlayClick = () => {
    setIsPlaying(true);
  };


  useEffect(() => {
    if (!inView && !autoPlay) {
      setIsPlaying(false);
    }
  }, [inView, autoPlay]);

  return (
    <section
      ref={sectionRef}
      className={[styles.section, animationClass, className].join(" ")}
      style={{ "--animate-duration": "900ms" }}
      aria-label="Feature video"
    >
      <video
        ref={videoRef}
        className={styles.video}
        preload="none"
        playsInline
        muted
        controls={false}
        loop={loop}
        /* poster={poster} */
      />


      <div className={styles.scrim} />


      {!isPlaying && (
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label="Play video"
        >
          
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="white"/>
          </svg>
        </button>
      )}

      {/* 
      <div className={styles.content}>
        <h2>Headline</h2>
        <p>Short supporting copy here.</p>
      </div>
      */}
    </section>
  );
}