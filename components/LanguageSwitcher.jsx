"use client";
import { usePathname, useRouter } from "next/navigation";
import { validRoutes } from "@/lib/validRoutes";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  //const validRoutes = ["/", "/about-us", "/services", "/contact", "/blog", "/faq", "/emergency-car-towing-services-in-dubai"];

  // ✅ Helpers
  const normalizePath = (path) => path.replace(/\/+$/, "") || "/";
  const getBasePath = (path) => normalizePath(path.split("?")[0].split("#")[0]);

  const switchLanguage = () => {
    const currentPath = getBasePath(pathname);
    const isArabic = currentPath.startsWith("/ar");
    const englishPath = isArabic ? currentPath.replace("/ar", "") || "/" : currentPath;

    let targetPath = "/";

    if (validRoutes.includes(englishPath)) {
      targetPath = isArabic
        ? englishPath
        : englishPath === "/" ? "/ar" : "/ar" + englishPath;
    } else {
      targetPath = isArabic ? "/" : "/ar";
    }

    router.push(targetPath);
  };

  return (
    <>
    <a
      href=""
      onClick={(e) => {
        e.preventDefault();
        switchLanguage();
      }}
      className="language-switcher"
    >
      {pathname.startsWith("/ar") ? "English" : "العربية"}
    </a>
    </>
  );
}