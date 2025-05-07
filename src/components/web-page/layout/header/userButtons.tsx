'use client';
import LoginButton from '@/components/web-page/layout/header/loginButton';
import SignUpButton from '@/components/web-page/layout/header/signUpButton';
import { useWebPageAuth } from '@/providers/webPageAuthProvider';
import UserMenu from '@/components/web-page/layout/header/userMenu';
import React from 'react';
import NotificationsMenu from '@/components/web-page/layout/header/notificationsMenu';
import MessagesMenu from '@/components/web-page/layout/header/messagesMenu';

const UserButtons = ({ language }: { language: string }) => {
  const { user } = useWebPageAuth();

  return (
    <div className="ml-4 flex items-center py-4 lg:space-x-8">
      {!!user && (
        <>
          <NotificationsMenu language={language}></NotificationsMenu>
          <MessagesMenu language={language}></MessagesMenu>
          <UserMenu language={language} />
        </>
      )}
      {!user && (
        <div className="flex w-full items-center justify-center space-x-4">
          <LoginButton language={language}></LoginButton>
          <SignUpButton language={language}></SignUpButton>
        </div>
      )}
    </div>
  );
};

export default UserButtons;
