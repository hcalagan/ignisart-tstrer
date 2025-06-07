/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAbstraxionAccount } from "../lib/xion";
import { uploadJSONToIPFS } from "../lib/ipfs";
import LoginButton from "../components/LoginButton";
import { translate } from "../lib/locale";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function EditProfilePage() {
  const { data: user } = useAbstraxionAccount();
  const router = useRouter();
  const locale = router.locale ?? process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";


  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error(`${translate("login", locale)} ${translate("first", locale)}`);
      return;
    }
    if (!name.trim()) {
      toast.error(translate("please enter name", locale));
      return;
    }

    setIsSaving(true);
    try {
      const profile = { name: name.trim(), bio: bio.trim() };
      const profileURI = await uploadJSONToIPFS(profile);

      // Di sini seharusnya kirim ke smart contract → bisa kamu tambahkan nanti
      console.log(`✅ Profile metadata uploaded to IPFS: ${profileURI}`);

      toast.success(translate("profile saved", locale));
   router.push(`/profile/${user.bech32Address}`);

    } catch (error: any) {
      toast.error(`${translate("failed to save profile", locale)}: ${error?.message || error}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-ash">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-flame dark:text-orange-400">
          {translate("edit profile", locale)}
        </h1>

        {!user ? (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {translate("please login to continue", locale)}
            </p>
            <div className="mt-4">
              <LoginButton />
            </div>
          </div>
        ) : (
          <div className="mt-4 w-full max-w-md mx-auto">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame text-sm"
                  placeholder={translate("enter your name", locale)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Bio</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame text-sm"
                  placeholder={translate("tell about yourself", locale)}
                />
              </label>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`mt-4 w-full px-4 py-2 text-white rounded-lg transition text-sm ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-flame hover:bg-orange-600"
                }`}
              >
                {isSaving ? translate("processing", locale) : translate("save profile", locale)}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
