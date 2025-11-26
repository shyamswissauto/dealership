"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import blogsData from '/data/pages.json';
import styles from "./BlogListing.module.css";


const posts = [
  {
    slug: "how-to-maintain-your-car-in-summer",
    title: "How to Maintain Your Car in Summer",
    excerpt:
      "High temperatures can be tough on your vehicle. Learn the essential checks to keep your car running smoothly in the UAE heat.",
    image: "/blog/summer-car-care.jpg",
    category: "Car Maintenance",
    date: "2025-07-10",
    readTime: "6 min read",
  },
  {
    slug: "benefits-of-regular-oil-change",
    title: "Top 5 Benefits of Regular Oil Changes",
    excerpt:
      "Oil changes are more than a routine service — they protect your engine, improve performance, and save you money in the long run.",
    image: "/blog/oil-change.jpg",
    category: "Service Tips",
    date: "2025-06-22",
    readTime: "4 min read",
  },
  {
    slug: "winter-tyre-safety-checklist",
    title: "Tyre Safety Checklist Before a Long Drive",
    excerpt:
      "Planning a road trip? Use this simple tyre inspection checklist to ensure a safe and comfortable journey.",
    image: "/blog/tyre-safety.jpg",
    category: "Safety",
    date: "2025-05-30",
    readTime: "5 min read",
  },
  // add more posts as needed
];

export default function BlogListing() {

    const initialBlogsToShow = 9; // Initial number of blogs to show
    const [visibleBlogsCount, setVisibleBlogsCount] = useState(initialBlogsToShow);
    
    const blogEntries = Object.entries(blogsData);
    const visibleBlogs = blogEntries.slice(0, visibleBlogsCount);

    const handleLoadMore = () => {
        setVisibleBlogsCount((prevCount) => prevCount + initialBlogsToShow);
    };


    const trimText = (input, length) => {
        if (input.length > length) {
          return input.substring(0, length) + '...';
        }
        return input;
      };

      
  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <article key={post.slug} className={styles.card}>
          <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
            <div className={styles.mediaWrap}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className={styles.media}
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
              />

              <span className={styles.category}>{post.category}</span>
            </div>

            <div className={styles.body}>
              <h3 className={styles.title}>{post.title}</h3>

              <p className={styles.meta}>
                <span>{formatDate(post.date)}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </p>

              <p className={styles.excerpt}>{post.excerpt}</p>

              <span className={styles.readMore}>Read more →</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

/* Shared date formatter */
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
