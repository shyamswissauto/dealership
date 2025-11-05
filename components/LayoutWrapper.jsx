// components/LayoutWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (pathname.startsWith("/ar")) {
      html.lang = "ar";
      // Do NOT set html.dir
      body.classList.add("is-arabic");
    } else {
      html.lang = "en";
      body.classList.remove("is-arabic");
    }
  }, [pathname]);

  return <>{children}</>;
}
