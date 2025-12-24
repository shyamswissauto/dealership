"use client";

import styles from "./BlogShowcase.module.css";
import Link from "next/link";

export default function BlogShowcase({ posts = [], basePath = "/blog", imageBase = "/images/blog" }) {
  // Convert object (from pasted.txt) to array if needed
  const list = Array.isArray(posts) ? posts : Object.entries(posts).map(([slug, p]) => ({ slug, ...p }));

  if (!list.length) return null;

  // First post is featured, next 4 are side cards
  const [featured, ...rest] = list;
  const side = rest.slice(0, 4);

  const imgSrc = (p) => {
    // if p.imgurl is already full URL, keep it
    if (!p?.imgurl) return "";
    if (p.imgurl.startsWith("http")) return p.imgurl;
    return `${imageBase}/${p.imgurl}`; // e.g. /images/blog/xxx.webp
  };

  return (
    <section className={styles.wrap} aria-labelledby="blog-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.kicker}>Latest from the Blog</p>
          <h2 id="blog-title" className={styles.title}>Insights, Tips & Updates</h2>
        </header>

        <div className={styles.grid}>
          {/* LEFT Featured */}
          <article className={styles.featured}>
            <Link className={styles.featuredLink} href={`${basePath}/${featured.slug}`}>
              <div className={styles.featuredMedia}>
                <img
                  src={imgSrc(featured)}
                  alt={featured.seoTitle || featured.title}
                  className={styles.featuredImg}
                  loading="lazy"
                />
              </div>

              <div className={styles.featuredBody}>
                <div className={styles.metaRow}>
                  {/* {featured.category && (
                    <span className={styles.badge}>{featured.category}</span>
                  )} */}
                  {featured.date && <span className={styles.meta}>{featured.date}</span>}
                </div>

                <h3 className={styles.featuredTitle}>{featured.title}</h3>

                {/* {featured.seoDesc && (
                  <p className={styles.excerpt}>{featured.seoDesc}</p>
                )} */}
              </div>
            </Link>
          </article>

          {/* RIGHT 2x2 cards */}
          <div className={styles.sideGrid}>
            {side.map((p) => (
              <article key={p.slug} className={styles.card}>
                <Link className={styles.cardLink} href={`${basePath}/${p.slug}`}>
                  <div className={styles.cardMedia}>
                    <img
                      src={imgSrc(p)}
                      alt={p.seoTitle || p.title}
                      className={styles.cardImg}
                      loading="lazy"
                    />
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.metaRow}>
                      {/* {p.category && <span className={styles.badgeSmall}>{p.category}</span>} */}
                      {/* {p.shortdate && <span className={styles.meta}>{p.shortdate}</span>} */}
                      {p.date && <span className={styles.meta}>{p.date}</span>}
                    </div>
                    <h4 className={styles.cardTitle}>{p.seoTitle || p.title}</h4>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Link className={styles.moreBtn} href={basePath}>View all Posts</Link>
        </div>
      </div>
    </section>
  );
}
