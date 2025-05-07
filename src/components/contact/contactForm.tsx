'use client';

import { useTranslation } from '@/app/i18n/client';
import { Label } from '@/components/shared/label';
import { Input } from '@/components/shared/input';
import { Textarea } from '@/components/shared/textarea';
import { sendContactMessage } from '@/service/backend/contact/service/contact.service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ContactForm({ language }: { language: string }) {
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
    <div className="w-full">
      {!submitted ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="contactName" className="text-[#565d6d]">
                {t('name')}
              </Label>
              <Input
                type="text"
                id="contactName"
                name="contactName"
                placeholder={t('name-placeholder')}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#565d6d]">
                {t('email')}
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder={t('email-placeholder')}
                required
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="subject" className="text-[#565d6d]">
              {t('subject')}
            </Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              placeholder={t('subject-placeholder')}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-[#565d6d]">
              {t('message')}
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              placeholder={t('message-placeholder')}
              required
              className="mt-1.5"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#15b7b9] px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-[#15b7b9]/90"
          >
            {t('send-message')}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#565d6d]">
            {t('message-sent')}
          </h2>
          <p className="mb-8 max-w-md text-[#565d6d]/80">
            {t('we-will-contact-soon')}
          </p>
          <button
            onClick={() => router.push(`/${language}/`)}
            className="rounded-lg bg-[#15b7b9] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#15b7b9]/90"
          >
            {t('back-home')}
          </button>
        </div>
      )}
    </div>
  );
}
