"use client";

import { useEffect, useState } from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { getAllPembayaran, updatePembayaran, createPembayaran, deletePembayaran } from '@/services/pembayaran-service';
import Loader from '@/components/common/Loader';
import { dateFormat } from '@/utils/date-format';
import { Pembayaran } from '@/interfaces/pembayaran';
import { exportToExcel, formatTableDataForExport } from '@/utils/excel';
import { Button } from '@/components/ui/button';
import { Download, Pencil, Trash } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

type FormData = {
   pasienId: string;
   jumlah: string;
   tanggal: string;
   metode: string;
};

export default function PembayaranView() {
   const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>([]);
   const [loading, setLoading] = useState(true);
   const [showForm, setShowForm] = useState(false);
   const [editId, setEditId] = useState<number | null>(null);

   const [formData, setFormData] = useState<FormData>({
      pasienId: "",
      jumlah: "",
      tanggal: "",
      metode: "CASH",
   });

   useEffect(() => {
      fetchPembayaran();
   }, []);

   const fetchPembayaran = async () => {
      try {
         const res = await getAllPembayaran();
         setDataPembayaran(res.data);
      } catch (error) {
         console.error("Gagal mengambil data pembayaran:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleEdit = (pembayaran: Pembayaran) => {
      setEditId(pembayaran.id);
      setFormData({
         pasienId: pembayaran.pasienId.toString(),
         jumlah: pembayaran.jumlah.toString(),
         tanggal: pembayaran.tanggal.split("T")[0],
         metode: pembayaran.metode,
      });
      setShowForm(true);
   };

   const handleDelete = async (id: number) => {
      if (confirm("Apakah Anda yakin ingin menghapus pembayaran ini?")) {
         try {
            await deletePembayaran(id);
            showSuccess("Pembayaran berhasil dihapus!");
            await fetchPembayaran();
         } catch (error) {
            console.error("Error:", error);
            showError("Gagal menghapus pembayaran.");
         }
      }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
         if (editId) {

            await updatePembayaran(editId, {
               pasienId: Number(formData.pasienId),
               jumlah: Number(formData.jumlah),
               tanggal: formData.tanggal,
               metode: formData.metode,
            });
            showSuccess("Pembayaran berhasil diperbarui!");
         } else {

            await createPembayaran({
               pasienId: Number(formData.pasienId),
               jumlah: Number(formData.jumlah),
               tanggal: formData.tanggal,
               metode: formData.metode,
            });
            showSuccess("Pembayaran berhasil dibuat!");
         }

         await fetchPembayaran();
         setShowForm(false);
         setFormData({ pasienId: "", jumlah: "", tanggal: "", metode: "CASH" });
         setEditId(null);
      } catch (error) {
         console.error("Error:", error);
         showError(editId ? "Gagal memperbarui pembayaran." : "Gagal membuat pembayaran.");
      }
   };

   const handleExportExcel = () => {
      const exportData = formatTableDataForExport(dataPembayaran, (item, index) => ({
         'No': index + 1,
         'Nama Pasien': item.pasien ? item.pasien.nama : 'Pasien tidak ditemukan',
         'Jumlah Bayar': item.jumlah,
         'Tanggal Bayar': item.tanggal,
         'Metode Pembayaran': item.metode,
      }));

      exportToExcel(exportData, 'Data_Pembayaran', 'Pembayaran');
   };

   if (loading) {
      return <Loader />;
   }

   return (
      <div className='space-y-2'>
         {showForm && (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-4">
               <div>
                  <label>Pasien ID</label>
                  <input
                     type="text"
                     name="pasienId"
                     value={formData.pasienId}
                     onChange={handleInputChange}
                     className="border rounded w-full p-2"
                     required
                  />
               </div>
               <div>
                  <label>Jumlah</label>
                  <input
                     type="number"
                     name="jumlah"
                     value={formData.jumlah}
                     onChange={handleInputChange}
                     className="border rounded w-full p-2"
                     required
                  />
               </div>
               <div>
                  <label>Tanggal</label>
                  <input
                     type="date"
                     name="tanggal"
                     value={formData.tanggal}
                     onChange={handleInputChange}
                     className="border rounded w-full p-2"
                     required
                  />
               </div>
               <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editId ? "Perbarui" : "Simpan"}
               </Button>
            </form>
         )}
         <div className='flex justify-end bg-white rounded-lg shadow p-2 gap-2'>
            <Button
               onClick={() => {
                  setShowForm(!showForm);
                  setEditId(null);
                  setFormData({ pasienId: "", jumlah: "", tanggal: "", metode: "CASH" });
               }}
               className="bg-blue-600 hover:bg-blue-700 text-white"
            >
               {showForm ? "Tutup Form" : "Buat Pembayaran"}
            </Button>
            <Button
               onClick={handleExportExcel}
               className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
               disabled={dataPembayaran.length === 0}
            >
               <Download size={16} />
               Export Excel
            </Button>
         </div>
         <div className="bg-white rounded-lg shadow p-4">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>No</TableHead>
                     <TableHead>Nama Pasien</TableHead>
                     <TableHead>Jumlah Bayar</TableHead>
                     <TableHead>Tanggal Bayar</TableHead>
                     <TableHead>Metode Pembayaran</TableHead>
                     <TableHead className='text-center'>Aksi</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {dataPembayaran.map((data, index) => (
                     <TableRow key={data.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{data.pasien ? data.pasien.nama : 'Pasien tidak ditemukan'}</TableCell>
                        <TableCell>{data.jumlah}</TableCell>
                        <TableCell>{dateFormat(data.tanggal)}</TableCell>
                        <TableCell>{data.metode}</TableCell>
                        <TableCell className='flex justify-center gap-1'>
                           <button
                              className='cursor-pointer'
                              onClick={() => handleEdit(data)}
                           >
                              <Pencil className='text-yellow-500' size={17} />
                           </button>
                           <button
                              className='cursor-pointer'
                              onClick={() => handleDelete(data.id)}
                           >
                              <span className='text-red-500'>
                                 <Trash size={17} />
                              </span>
                           </button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}