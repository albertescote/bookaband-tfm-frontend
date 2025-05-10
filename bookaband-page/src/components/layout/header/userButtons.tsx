'use client';
import LoginButton from '@/components/layout/header/loginButton';
import SignUpButton from '@/components/layout/header/signUpButton';
import { useAuth } from '@/providers/authProvider';
import UserMenu from '@/components/layout/header/userMenu';
import React from 'react';
import NotificationsMenu from '@/components/layout/header/notificationsMenu';
import MessagesMenu from '@/components/layout/header/messagesMenu';

const UserButtons = ({ language }: { language: string }) => {
  const { user } = useAuth();

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
