import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/header/navBar';
import RegistrationButtons from '@/components/layout/header/registrationButtons';

export default async function Header({ language }: { language: string }) {
  return (
    <header className="relative flex items-center justify-between bg-gradient-to-r from-[#b4c6ff] to-[#b4e6ff] px-6 py-4 text-gray-900">
      <div className="relative flex items-center space-x-4 text-[#220c10]">
        <Link className="text-xl font-bold" href="/">
          <div className="relative flex items-center space-x-4 text-[#220c10]">
            <Image
              src="/assets/icon.png"
              alt="icon"
              height="60"
              width="60"
            ></Image>
            <span className="title-text">Trisbar</span>
          </div>
        </Link>
      </div>
      <div className="relative flex items-center space-x-4 text-[#220c10]">
        <Navbar language={language} />
        <RegistrationButtons language={language}></RegistrationButtons>
      </div>
    </header>
  );
}
