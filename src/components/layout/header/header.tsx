import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/header/navBar';
import RegistrationButtons from '@/components/layout/header/registrationButtons';

export default async function Header({ language }: { language: string }) {
  return (
    <header className="relative flex items-center justify-between bg-[#f3f4f6] px-6 py-4">
      <div className="relative flex items-center space-x-4">
        <Link href="/">
          <Image
            src="/assets/logo.svg"
            alt="logo"
            height="200"
            width="200"
            className="header-logo"
          ></Image>
        </Link>
        <Navbar language={language} />
      </div>
      <RegistrationButtons language={language}></RegistrationButtons>
    </header>
  );
}
