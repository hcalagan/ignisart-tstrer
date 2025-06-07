import { useAbstraxionAccount } from "../lib/xion";
import { translate } from "../lib/locale";
import { useRouter } from "next/router";

export default function LoginButton() {
  const { data: user, login, logout } = useAbstraxionAccount();
  const router = useRouter();
  const locale = router.locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";

  const shortAddress =
    typeof user?.bech32Address === "string" && user.bech32Address.length >= 10
      ? `${user.bech32Address.slice(0, 6)}…${user.bech32Address.slice(-4)}`
      : "";

  if (user && user.bech32Address) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-green-400">●</span>
        <p className="text-white">{shortAddress}</p>
        <button
          onClick={logout}
          className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition text-xs"
        >
          {translate("logout", locale)}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-3 py-1 bg-flame dark:bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
    >
      {translate("login", locale)}
    </button>
  );
}
