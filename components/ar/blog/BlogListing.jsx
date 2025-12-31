"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import blogsData from '/data/pages-ar.json';
import styles from "./BlogListing.module.css";



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
        <>
        <div className={styles.grid}>


                    {visibleBlogs.map(([slug, { title, imgurl, shortdate, category, categoryurl, excerpt }]) => {

                        

                        return (
                            <article key={slug} className={styles.card}>
                                <Link href={`/ar/blog/${slug}`} className={styles.cardLink}>
                                    <div className={styles.mediaWrap}>
                                        <Image
                                            src={"/assets/blog/" + imgurl}
                                            alt={title}
                                            fill
                                            className={styles.media}
                                            sizes="(max-width: 768px) 100vw,
                                            (max-width: 1200px) 50vw,
                                            33vw"
                                        />
                                    </div>

                                    <div className={styles.body}>
                                        <h3 className={styles.title}>{title}</h3>

                                        <p className={styles.meta}>
                                            <span>{formatDate(shortdate)}</span>
                                        </p>

                                        {/* <p className={styles.excerpt}>{excerpt}</p> */}

                                        <span className={styles.readMore}>Read more →</span>
                                    </div>
                                </Link>
                            </article>
                        );
                    })}


                

                
            


        </div>

        {visibleBlogsCount < blogEntries.length && (
                    <div className="row loadMore">
                        <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                            <span>Load More</span>
                        </button>
                    </div>
                )}

        </>
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
