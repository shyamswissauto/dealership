"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GtmPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "pageview", page_location: url });
  }, [pathname, searchParams]);

  return null;
}
