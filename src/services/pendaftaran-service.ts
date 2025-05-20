export const getAllPendaftaran = async () => {
   try {
      const res = await fetch("/api/pendaftaran", {
         cache: "no-store",
      });

      console.log(res);

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

export const createPendaftaran = async (data: {
   pasienId: number;
   keluhan: string;
}) => {
   try {
      const res = await fetch("/api/pendaftaran", {
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
