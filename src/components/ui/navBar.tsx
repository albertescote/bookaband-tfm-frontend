'use client';
import {useTranslation} from '@/app/i18n/client';
import {useEffect, useState} from "react";
import {validateAccessToken} from "@/service/auth";
import NavLink from "@/components/ui/navLink";

export default function Navbar({ language }: { language: string }) {
    const { t } = useTranslation(language, 'home');
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        validateAccessToken().then((result) => {
            setAuthenticated(!!result);
        });
    }, []);

    return (
        <nav className="flex space-x-4 p-4">
            {authenticated && (
                <div className="flex">
                    <NavLink href={`/profile`} label={t('profile-tab')} />
                </div>
            )}
        </nav>
    );
}
