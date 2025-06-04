export const getAllPembayaran = async () => {
   try {
      const res = await fetch("/api/admin/pembayaran", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal fetch pembayaran: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat mengambil data pembayaran:", error);
      throw error;
   }
};
