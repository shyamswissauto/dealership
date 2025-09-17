"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
/* import styles from "./DualImageIntro.module.css"; */

export default function DualImageIntro({
  title = "HEADLINE",
  subtitle = "LUXURY PLUS",
  leftImg = { src: "/assets/home/feature2.png", alt: "Blue car" },
  rightImg = { src: "/assets/home/feature1.png", alt: "White car" },
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const targets = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
          }
        });
      },
      { threshold: 0.28 } // reveal when ~30% visible
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
    <section className="showcase-section">
        {/* <div className="text-content">
          <h1 className="headline">HEADLINE</h1>
          <p className="sub-headline">LUXURY PLUS</p>
        </div> */}
        <div className="image-stack">
            <div className="text-content">
                <h1 className="headline">HEADLINE</h1>
                <p className="sub-headline">LUXURY PLUS</p>
            </div>
          {/* Background City Image */}
          <div className="image-container city-image-wrapper">
            <Image
              src="/assets/home/feature1.png"
              alt="Modern city skyline at night"
              layout="fill"
              objectFit="cover"
              className="image-element"
            />
          </div>

          {/* Blue Car Image */}
          <div className="image-container blue-car-wrapper">
             <Image
              src="/assets/home/feature2.png"
              alt="Blue luxury SUV on a city street"
              layout="fill"
              objectFit="contain"
              className="image-element"
            />
          </div>

          
        </div>
      </section>
      <style jsx>{`
        /* Reset and base styles */

            /* Main container for the page content */
            .container {
            max-width: 1440px;
            margin: 0 auto;
            padding: 2rem;
            }

            /* Section container using Flexbox for alignment */
            .showcase-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 80vh;
            }

            /* Text content styling */
            .text-content {
            width: 100%;
            padding: 2rem 0;
            text-align: left;
            }

            .headline {
            font-size: 5rem;
            font-weight: 800;
            letter-spacing: -0.05em;
            line-height: 1;
            margin: 0;
            }

            .sub-headline {
            font-size: 5rem;
            font-weight: 300;
            letter-spacing: -0.05em;
            line-height: 1;
            margin: 0;
            color: #4a5568;
            }

            /* Image stacking container */
            .image-stack {
            position: relative;
            width: 100%;
            height: 600px; /* Defines the total height of the canvas */
            margin-top: 2rem;
            }

            .image-container {
            position: absolute;
            }

            .image-element {
            border-radius: 0.5rem;
            }

            /* Specific positioning for each image layer */
            .city-image-wrapper {
            top: 0;
            right: 0;
            width: 65%;
            height: 75%;
            z-index: 1;
            }

            .blue-car-wrapper {
            top: 25%;
            left: 0;
            width: 60%;
            height: 70%;
            z-index: 2;
            filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
            }

            .white-car-wrapper {
            bottom: 0;
            right: 5%;
            width: 55%;
            height: 65%;
            z-index: 3;
            filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.25));
            }


            /* Responsive adjustments for tablets and smaller devices */
            @media (max-width: 1024px) {
            .headline,
            .sub-headline {
                font-size: 4rem;
            }

            .image-stack {
                height: 500px;
            }
            }

            /* Responsive adjustments for mobile devices */
            @media (max-width: 768px) {
            .showcase-section {
                align-items: flex-start;
            }

            .text-content {
                text-align: left;
            }

            .headline,
            .sub-headline {
                font-size: 3rem;
            }
            
            .image-stack {
                height: 400px;
            }

            /* Adjust image positions slightly for a better fit on smaller screens */
            .blue-car-wrapper {
                width: 70%;
            }

            .white-car-wrapper {
                width: 65%;
                right: 0;
            }
            }

      `}</style>
      </>
  );
}
