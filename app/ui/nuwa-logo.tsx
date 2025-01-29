import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import { roboto } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${roboto.className} flex flex-col justify-center items-center leading-none text-black`}
    >
      <CubeTransparentIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Nuwa</p>
    </div>
  );
}
