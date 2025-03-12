import { inter } from '@/app/ui/fonts';
import Image from 'next/image';

export default function NuwaLogo() {
  return (
    <div
      className={`${inter.className} flex flex-col justify-center items-center leading-none text-black dark:text-white`}
    >
      <Image
        alt=""
        src="/nuwa-logo1.png"
        width={32}
        height={32}
        className="size-8 rounded-full"
      />
      <p className="text-[44px]">Nuwa</p>
    </div>
  );
}
