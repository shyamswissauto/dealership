// app/blog/[slug]/page.jsx
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { notFound } from "next/navigation";
import HeaderNav from "@/components/ar/client/HeaderNavClientAr";
import HeroSlider from "@/components/ar/pages/HeroSliderBlogPages";
import Footer from "@/components/ar/client/FooterClient";
import styles from "./BlogDetail.module.css";

/* ---------- helpers ---------- */

function loadPagesJson() {
  const filePath = path.join(process.cwd(), "data", "pages-ar.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function formatDate(isoOrText) {
  // If your date is already formatted text, just return it
  if (!isoOrText) return "";
  const d = new Date(isoOrText);
  if (Number.isNaN(d.getTime())) return isoOrText; // fallback to raw string
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ---------- SEO / metadata ---------- */

export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅
  const data = loadPagesJson();

  if (!data[slug]) notFound();
  const page = data[slug];

  const pageUrl = `https://www.mysinotruk.ae/ar/blog/${page.slug || slug
    }/`;

  const title =
    page.seoTitle || "Sinotruk UAE";
  const description =
    page.seoDesc || "Sinotruk UAE";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "www.mysinotruk.ae",
      images: [
        {
          url: `/assets/blog/${page.imgurl}`,
          alt: page.title || "Sinotruk UAE",
        },
      ],
      locale: "en_US",
      type: "article",
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        en: pageUrl,
      },
    },
  };
}

export async function generateStaticParams() {
  const data = loadPagesJson();
  return Object.keys(data).map((slug) => ({ slug }));
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params; // ✅
  const data = loadPagesJson();

  if (!data[slug]) {
    notFound();
  }

  const page = data[slug];
  const { title, date, category, categoryurl, content, imgurl } = page;

  const latestBlogs = Object.keys(data)
    .filter((key) => key !== slug)
    .slice(0, 3)
    .map((key) => ({
      slug: key,
      title: data[key].title,
      imgurl: data[key].imgurl,
      date: data[key].date,
    }));

  // build hero slides using this blog title
  const HERO_SLIDES = [
    {
      desktop: "/assets/hero/business-page.webp",
      mobile: "/assets/hero/listing-page-banner.webp",
      title, // blog title here
      subtitle: date,
      align: "left",
      valign: "end",
      overlay: "rgba(0,0,0,0.8)",
      learnMoreHref: "",
      bookHref: "",
      className: "",
    },
  ];

  return (
    <>

      <HeaderNav />
      <HeroSlider slides={HERO_SLIDES} autoPlayMs={6000} />
      <main className={styles.wrap}>


        <article className={styles.article}>
          {/* Header + hero image */}
          {/* <header className={styles.header}>
          <div className={styles.metaTop}>
            {category && (
              <Link
                href={`/category/${categoryurl || ""}`}
                className={styles.category}
              >
                {category}
              </Link>
            )}
            {date && <span className={styles.date}>{formatDate(date)}</span>}
          </div>

          <h1 className={styles.title}>{title}</h1>

          {page.seoDesc && (
            <p className={styles.excerpt}>{page.seoDesc}</p>
          )}

          <div className={styles.metaBottom}>
            
            {date && <span>{formatDate(date)}</span>}
          </div>

          {imgurl && (
            <div className={styles.heroImageWrap}>
              <Image
                src={`/assets/images/blog/${imgurl}`}
                alt={title}
                fill
                className={styles.heroImage}
                sizes="100vw"
                priority
              />
            </div>
          )}
        </header> */}

          {/* Body + sidebar wrapper */}
          <div className={styles.layout}>
            {/* Main body */}
            <div className={styles.body}>
              {imgurl && (
                  <div className={styles.heroImageWrap}>
                    <Image
                      src={`/assets/blog/${imgurl}`}
                      alt={title}
                      fill
                      className={styles.heroImage}
                      sizes="100vw"
                      priority
                    />
                  </div>
                )}

              <div className={styles.content}>
                
                {content ? parse(content) : null}
              </div>


            </div>

            {/* Sidebar */}
            {/* <aside className={styles.sidebar}>
            
            <section className={styles.sidebarBlock}>
              <h3 className={styles.sidebarTitle}>Categories</h3>
              <ul className={styles.categoryList}>
                <li>
                  <Link href="/category/car-recovery">Car Recovery</Link>
                </li>
                <li>
                  <Link href="/category/roadside-assistance">
                    Roadside Assistance
                  </Link>
                </li>
                <li>
                  <Link href="/category/battery-replacement">
                    Battery Replacement
                  </Link>
                </li>
                <li>
                  <Link href="/category/car-towing">Car Towing</Link>
                </li>
                <li>
                  <Link href="/category/flatbed-recovery">
                    Flatbed Recovery
                  </Link>
                </li>
              </ul>
            </section>

            
            <section className={styles.sidebarBlock}>
              <h3 className={styles.sidebarTitle}>Recent Posts</h3>
              <div className={styles.recentList}>
                {latestBlogs.map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className={styles.recentItem}
                  >
                    <div className={styles.recentThumb}>
                      {blog.imgurl && (
                        <Image
                          src={`/assets/images/blog/${blog.imgurl}`}
                          alt={blog.title}
                          fill
                          className={styles.recentImage}
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className={styles.recentContent}>
                      <h4>{blog.title}</h4>
                      {blog.date && (
                        <p>{formatDate(blog.date)}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside> */}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
