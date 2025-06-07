"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { languages, translate } from "../lib/locale";
import SearchBar from "./SearchBar";
import LoginButton from "./LoginButton";

export default function Navbar() {
  const router = useRouter();

  // Pastikan locale tidak undefined
  const locale = router.locale ?? process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";

  const switchLanguage = (code: string) => {
    router.push(router.pathname, router.asPath, { locale: code });
  };

  return (
    <nav className="bg-ember dark:bg-gray-900 shadow-md fixed top-0 w-full z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" locale={locale} className="text-2xl font-bold text-flame dark:text-orange-400">
            IgnisArt
          </Link>
          <div className="hidden sm:flex space-x-4">
            <Link href="/gallery" locale={locale} className="text-sm text-gray-300 hover:text-white">
              {translate("gallery of whispers", locale)}
            </Link>
            <Link href="/marketplace" locale={locale} className="text-sm text-gray-300 hover:text-white">
              {translate("marketplace", locale)}
            </Link>
            <Link href="/upload" locale={locale} className="text-sm text-gray-300 hover:text-white">
              {translate("upload art", locale)}
            </Link>
          </div>
          <SearchBar />
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          {languages.map((lng) => (
            <button
              key={lng.code}
              onClick={() => switchLanguage(lng.code)}
              className={`text-sm ${lng.code === locale ? "font-semibold text-white" : "text-gray-300 hover:text-white"}`}
            >
              {lng.label}
            </button>
          ))}
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}
