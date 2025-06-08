/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResepFilter {
   status?: string;
   search?: string;
}

export interface ProcessResepData {
   status: "DIPROSES" | "SELESAI" | "DIBATALKAN";
   catatan?: string;
}

export async function getResepList(filter?: ResepFilter): Promise<any> {
   try {
      const queryParams = new URLSearchParams();

      if (filter?.status) {
         queryParams.append("status", filter.status);
      }

      if (filter?.search) {
         queryParams.append("search", filter.search);
      }

      const queryString = queryParams.toString()
         ? `?${queryParams.toString()}`
         : "";

      const response = await fetch(`/api/farmasi/resep${queryString}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });

      if (!response.ok) {
         throw new Error("Gagal mengambil data resep");
      }

      const result = await response.json();
      return result.data;
   } catch (error) {
      console.error("Error in getResepList:", error);
      throw error;
   }
}

export async function getResepDetail(id: number): Promise<any> {
   try {
      const response = await fetch(`/api/farmasi/resep/${id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      });

      if (!response.ok) {
         throw new Error("Gagal mengambil detail resep");
      }

      const result = await response.json();
      return result.data;
   } catch (error) {
      console.error("Error in getResepDetail:", error);
      throw error;
   }
}

export async function processResep(
   id: number,
   data: ProcessResepData
): Promise<any> {
   try {
      const response = await fetch(`/api/farmasi/resep/${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || "Gagal memproses resep");
      }

      const result = await response.json();
      return result.data;
   } catch (error) {
      console.error("Error in processResep:", error);
      throw error;
   }
}
