export const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
];

export type Translations = { [key: string]: { en: string; id: string } };

export const t: Translations = {
  "gallery of whispers": { en: "Gallery of Whispers", id: "Galeri Bisikan" },
  "upload art": { en: "Upload Art", id: "Unggah Karya" },
  "search": { en: "Search", id: "Cari" },
  "login": { en: "Login", id: "Masuk" },
  "logout": { en: "Logout", id: "Keluar" },
  "my studio": { en: "My Studio", id: "Studio Saya" },
  "marketplace": { en: "Marketplace", id: "Pasar" },
  "edit profile": { en: "Edit Profile", id: "Sunting Profil" },
  "artist profile": { en: "Artist Profile", id: "Profil Seniman" },
  "loading": { en: "Loading…", id: "Memuat…" },
  "please login to upload": { en: "Please login to upload.", id: "Silakan masuk untuk mengunggah." },
  "art title": { en: "Art Title", id: "Judul Karya" },
  "art description": { en: "Art Description", id: "Deskripsi Karya" },
  "tags": { en: "Tags", id: "Tag" },
  "mint gasless": { en: "Mint Gasless", id: "Mint Tanpa Gas" },
  "processing": { en: "Processing…", id: "Memproses…" },
  "no art yet": { en: "No art yet. Create some!", id: "Belum ada karya. Buat lebih dulu!" },
  "enter price in USDC": { en: "Enter price in USDC (e.g. 10)", id: "Masukkan harga dalam USDC (misal 10)" },
  "list for sale": { en: "List for Sale", id: "Daftarkan Jual" },
  "no listings": { en: "No listings currently.", id: "Belum ada listing saat ini." },
  "no results": { en: "No results found.", id: "Tidak ada hasil ditemukan." },
  "art detail": { en: "Art Detail", id: "Detail Karya" },
  "comments & discussion": { en: "Comments & Discussion", id: "Komentar & Diskusi" },
  "reply": { en: "Reply", id: "Balas" },
  "write a comment": { en: "Write a comment…", id: "Tulis komentar…" },
  "write a reply": { en: "Write a reply…", id: "Tulis balasan…" },
  "post comment": { en: "Post Comment", id: "Kirim Komentar" },
  "post reply": { en: "Post Reply", id: "Kirim Balasan" },
  "profile saved": { en: "Profile saved!", id: "Profil tersimpan!" },
  "no profile": { en: "This user has not created a profile.", id: "Pengguna ini belum membuat profil." },
  "please login to view studio": { en: "Please login to view your studio.", id: "Silakan masuk untuk melihat studio Anda." },
  "purchase successful": { en: "Purchase successful!", id: "Pembelian berhasil!" },
};

export function translate(key: string, locale: string) {
  return t[key]?.[locale as "en" | "id"] || t[key]?.en || key;
}