"use client";

import { useEffect, useState } from "react";

export function NavbarClient({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 10);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-sand/90 backdrop-blur-md shadow-[0_1px_2px_rgba(42,36,32,0.06),0_8px_24px_rgba(42,36,32,0.06)] nav-scrolled"
          : "nav-transparent"
      }`}
    >
      {children}
    </header>
  );
}
