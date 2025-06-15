export async function createResepObat(data: {
   dokterId: string;
   obatId: string;
   jumlah: string;
   aturan: string;
   rekamMedisId: string | null;
}) {
   const response = await fetch("/api/dokter/resep", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal membuat resep obat.");
   }

   return response.json();
}
