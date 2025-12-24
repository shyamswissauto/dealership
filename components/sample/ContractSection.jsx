import Image from "next/image";
import s from "./ContractSection.module.css";

export default function ContractSection({
  title = "Sinotruk Warranty and\nService Packages",
  desc = "Start your journey with the sinotruk G700, a plug-in hybrid SUV that redefines intelligent performance through unmatched power and opulence.",
  btnText = "Download the sinotruk G700 Specs Brochure",
  btnHref = "#",
  image = "/imagesg700.jpg",
  imageAlt = "G700 in desert",
}) {
  return (
    <section className={s.wrap} aria-label="Promotion">
      <div className={s.inner}>
        <div className={s.box}>
          <div className={s.media}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 900px) 92vw, 700px"
              className={s.img}
              priority={false}
            />
          </div>

          <div className={s.content}>
            <h2 className={s.title}>
              {String(title).split("\n").map((line, i) => (
                <span key={i} className={s.line}>
                  {line}
                </span>
              ))}
            </h2>

            <p className={s.desc}>{desc}</p>

            {/* <a href={btnHref} className={s.btn}>
              {btnText}
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}
