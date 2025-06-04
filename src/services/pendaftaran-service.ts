export const getAllPendaftaran = async () => {
   try {
      const res = await fetch("/api/admin/pendaftaran", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal fetch pendaftaran: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat mengambil data pendaftaran:", error);
      throw error;
   }
};

export const createPendaftaran = async (data: { keluhan: string }) => {
   try {
      const res = await fetch("/api/admin/pendaftaran", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
         cache: "no-store",
      });

      if (!res.ok) {
         const errorBody = await res.json();
         throw new Error(
            `Gagal membuat pendaftaran: ${errorBody.message || res.statusText}`
         );
      }

      const result = await res.json();
      return result;
   } catch (error) {
      console.error("Error saat membuat pendaftaran:", error);
      throw error;
   }
};

import { StatusType } from "@/interfaces/status";

export const updatePendaftaranStatus = async (
   id: number,
   status: StatusType
) => {
   try {
      const res = await fetch(`/api/admin/pendaftaran/${id}/status`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ status }),
      });

      if (!res.ok) {
         throw new Error("Gagal mengubah status pendaftaran");
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat update status:", error);
      throw error;
   }
};
