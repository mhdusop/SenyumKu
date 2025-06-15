import { Obat } from "@/interfaces/obat";

export async function getDaftarObat(): Promise<Obat[]> {
   const response = await fetch("/api/farmasi/obat", {
      method: "GET",
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal mengambil data obat.");
   }

   const data = await response.json();
   return data.data;
}

export async function createObat(obat: Omit<Obat, "id">): Promise<Obat> {
   const response = await fetch("/api/farmasi/obat", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(obat),
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal menambahkan data obat.");
   }

   const data = await response.json();
   return data.data;
}

export async function updateObat(
   id: number,
   obat: Omit<Obat, "id">
): Promise<Obat> {
   const response = await fetch(`/api/farmasi/obat/${id}`, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(obat),
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal memperbarui data obat.");
   }

   const data = await response.json();
   return data.data;
}

export async function deleteObat(id: number): Promise<void> {
   const response = await fetch(`/api/farmasi/obat/${id}`, {
      method: "DELETE",
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal menghapus data obat.");
   }
}
