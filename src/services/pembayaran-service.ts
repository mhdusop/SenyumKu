import { Pembayaran } from "@/interfaces/pembayaran";

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

export const createPembayaran = async (
   pembayaranData: Omit<Pembayaran, "id" | "pasien">
) => {
   try {
      const res = await fetch("/api/admin/pembayaran", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(pembayaranData),
      });

      if (!res.ok) {
         throw new Error(
            `Gagal membuat pembayaran: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat membuat pembayaran:", error);
      throw error;
   }
};

export const updatePembayaran = async (
   id: number,
   pembayaranData: Omit<Pembayaran, "id" | "pasien">
) => {
   try {
      const res = await fetch(`/api/admin/pembayaran/${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(pembayaranData),
      });

      if (!res.ok) {
         throw new Error(
            `Gagal update pembayaran: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat update pembayaran:", error);
      throw error;
   }
};

export const deletePembayaran = async (id: number) => {
   try {
      const res = await fetch(`/api/admin/pembayaran/${id}`, {
         method: "DELETE",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal menghapus pembayaran: ${res.status} ${res.statusText}`
         );
      }
   } catch (error) {
      console.error("Error saat menghapus pembayaran:", error);
      throw error;
   }
};
