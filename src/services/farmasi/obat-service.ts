export async function getDaftarObat() {
   const response = await fetch("/api/farmasi/obat", {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal mengambil daftar obat.");
   }

   return response.json();
}
