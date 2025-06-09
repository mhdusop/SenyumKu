/* eslint-disable @typescript-eslint/no-explicit-any */
// services/rekamMedisService.ts
import { RekamMedis } from "@/interfaces/rekam-medis";

export const getRekamMedisList = async () => {
   try {
      const res = await fetch("/api/dokter/rekam-medis", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal fetch rekam medis: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.data;
   } catch (error) {
      console.error("Error saat mengambil data rekam medis:", error);
      throw error;
   }
};

export const createRekamMedis = async (payload: any) => {
   try {
      const res = await fetch("/api/dokter/rekam-medis", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(payload),
      });

      if (!res.ok) {
         const errorData = await res.json();
         throw new Error(
            errorData.error ||
               `Gagal membuat rekam medis: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.data;
   } catch (error) {
      console.error("Error saat membuat rekam medis:", error);
      throw error;
   }
};

export const updateRekamMedis = async (
   id: number,
   rekamMedisData: Partial<RekamMedis>
) => {
   try {
      const res = await fetch(`/api/dokter/rekam-medis`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ id, ...rekamMedisData }),
      });

      if (!res.ok) {
         throw new Error(
            `Gagal memperbarui rekam medis: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.data;
   } catch (error) {
      console.error("Error saat memperbarui rekam medis:", error);
      throw error;
   }
};

export const deleteRekamMedis = async (id: number) => {
   try {
      const res = await fetch(`/api/dokter/rekam-medis?id=${id}`, {
         method: "DELETE",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal menghapus rekam medis: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.message;
   } catch (error) {
      console.error("Error saat menghapus rekam medis:", error);
      throw error;
   }
};
