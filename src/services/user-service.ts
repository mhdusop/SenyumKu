export type Role = "PASIEN" | "DOKTER" | "ADMINISTRASI" | "PENGELOLA_OBAT";

export interface CreateUserInput {
   username: string;
   password: string;
   role: Role;
   nama: string;
   alamat?: string;
   noTelp?: string;
   spesialisasi?: string;
}

export const getAllUsers = async () => {
   const res = await fetch("/api/user", {
      cache: "no-store",
   });

   if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch users");
   }

   return res.json();
};

export const createUser = async (data: CreateUserInput) => {
   const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         username: data.username,
         password: data.password,
         role: data.role,
         profile: {
            nama: data.nama,
            noTelp: data.noTelp,
            spesialisasi: data.spesialisasi,
         },
      }),
      cache: "no-store",
   });

   if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create user");
   }

   return res.json();
};

export const getUserById = async (id: number) => {
   const res = await fetch(`/api/user/${id}`, {
      cache: "no-store",
   });

   if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch user");
   }

   return res.json();
};

export const updateUser = async (
   id: number,
   data: Partial<CreateUserInput>
) => {
   const res = await fetch(`/api/user/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
   });

   if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update user");
   }

   return res.json();
};

export const deleteUser = async (id: number) => {
   const res = await fetch(`/api/user/${id}`, {
      method: "DELETE",
      cache: "no-store",
   });

   if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete user");
   }

   return res.json();
};
