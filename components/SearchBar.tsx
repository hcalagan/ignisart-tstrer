import React, { useState } from "react";
import { useRouter } from "next/router";
import { translate } from "../lib/locale";

export default function SearchBar() {
  const router = useRouter();
  const locale = router.locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query.trim())}`, undefined, { locale });
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-1">
      <input
        type="text"
        placeholder={`${translate("search", locale)}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-400 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-flame dark:bg-gray-800 dark:text-white w-24 sm:w-40"
      />
      <button type="submit" className="px-2 py-1 bg-flame text-white rounded-r-lg hover:bg-orange-600 transition text-sm">
        🔍
      </button>
    </form>
  );
}
