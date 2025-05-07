'use client';

import { useTranslation } from '@/app/i18n/client';
import { Label } from '@/components/shared/label';
import { Input } from '@/components/shared/input';
import { Textarea } from '@/components/shared/textarea';
import { sendContactMessage } from '@/service/backend/contact/service/contact.service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Contact({ language }: { language: string }) {
  const { t } = useTranslation(language, 'contact');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const name = form.contactName.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message || !subject) {
      toast.error(t('missing-fields'));
      return;
    }

    try {
      await sendContactMessage({
        name,
        email,
        subject,
        message,
      });

      setSubmitted(true);
    } catch (error) {
      toast.error(t('error-sending'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-md">
        {!submitted ? (
          <>
            <h1 className="mb-2 text-center text-3xl font-extrabold text-[#222]">
              {t('contact-title')}
            </h1>
            <p className="mb-8 text-center text-gray-600">
              {t('contact-subtitle')}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="contactName" className="text-gray-700">
                  {t('name')}
                </Label>
                <Input
                  type="text"
                  id="contactName"
                  name="contactName"
                  placeholder={t('name-placeholder')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700">
                  {t('email')}
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('email-placeholder')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-gray-700">
                  {t('subject')}
                </Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder={t('subject-placeholder')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-gray-700">
                  {t('message')}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t('message-placeholder')}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-6 py-3 text-center font-bold text-white transition-transform hover:scale-105"
              >
                {t('send-message')}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h2 className="mb-4 text-2xl font-bold text-[#222]">
              {t('message-sent')}
            </h2>
            <p className="mb-8 max-w-md text-center text-gray-600">
              {t('we-will-contact-soon')}
            </p>
            <button
              onClick={() => router.push(`/${language}/`)}
              className="rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-6 py-3 font-bold text-white transition-transform hover:scale-105"
            >
              {t('back-home')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
