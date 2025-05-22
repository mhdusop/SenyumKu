import Image, { StaticImageData } from "next/image";

interface Props {
   name: string;
   logo: string | StaticImageData
}

export default function HelloComponent({ name, logo }: Props) {
   return (
      <div className="flex justify-between items-center gap-4 bg-white rounded-lg shadow p-4">
         <div className="space-y-1">
            <h1 className="font-semibold text-2xl">Halo, {name} 👋</h1>
            <p className="text-sm/6 text-gray-700">
               Selamat datang di dashboard pribadi Anda. Di sini Anda Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, beatae?
            </p>
         </div>
         <div className="hidden md:block">
            <Image src={logo} alt="Logo-1" className="w-50" />
         </div>
      </div>
   )
}