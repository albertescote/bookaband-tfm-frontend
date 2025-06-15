'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, useChat } from '@/hooks/useSocket';
import {
  Download,
  FileText,
  MessageSquareOff,
  MessageSquareWarning,
  Paperclip,
  Send,
  Smile,
  X,
} from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { ChatHistory } from '@/service/backend/chat/domain/chatHistory';
import { getChatById } from '@/service/backend/chat/service/chat.service';
import { getAvatar } from '@/components/shared/avatar';
import { Spinner } from '@/components/shared/spinner';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useAuth } from '@/providers/authProvider';
import BookingNotification from './bookingNotification';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface ChatProps {
  language: string;
  chatId?: string;
  initialChat?: ChatHistory;
}

const Chat: React.FC<ChatProps> = ({ language, chatId, initialChat }) => {
  const { t } = useTranslation(language, 'chat');
  const { selectedBand } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<ChatHistory | undefined>(initialChat);
  const [isLoading, setIsLoading] = useState<boolean>(!initialChat);
  const [senderId, setSenderId] = useState<string>('');
  const [recipientId, setRecipientId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | undefined>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatId && !initialChat) {
      getChatById(chatId).then((chat: ChatHistory | undefined) => {
        setIsLoading(false);
        setChat(chat);
        setTimeout(scrollToBottom, 100);
      });
    } else if (initialChat) {
      setIsLoading(false);
      setChat(initialChat);
      setTimeout(scrollToBottom, 100);
    } else {
      setIsLoading(false);
    }
  }, [chatId, initialChat]);

  useEffect(() => {
    if (chatId && selectedBand) {
      setIsLoading(true);
      setAllMessages([]);
      getChatById(chatId)
        .then((chat: ChatHistory | undefined) => {
          if (chat && chat.band.id === selectedBand.id) {
            setChat(chat);
            setTimeout(scrollToBottom, 100);
          } else {
            setChat(undefined);
          }
        })
        .catch((error) => {
          console.error('Error fetching chat:', error);
          setChat(undefined);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [chatId, selectedBand]);

  useEffect(() => {
    if (chat) {
      const newSenderId = chat.band.id;
      const newRecipientId = chat.user.id;
      const newImageUrl = chat.user?.imageUrl;
      const newDisplayName =
        chat.user?.firstName + ' ' + chat.user?.familyName || t('unknown');

      setSenderId(newSenderId);
      setRecipientId(newRecipientId);
      setImageUrl(newImageUrl);
      setDisplayName(newDisplayName);

      setAllMessages(
        chat.messages.map((msg) => ({
          chatId: chat.id,
          senderId: msg.senderId,
          recipientId: msg.recipientId,
          message: msg.message || '',
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          fileUrl: msg.fileUrl,
          bookingMetadata: msg.bookingMetadata,
        })),
      );
      setTimeout(scrollToBottom, 100);
    } else {
      setSenderId('');
      setRecipientId('');
      setImageUrl('');
      setDisplayName('');
      setAllMessages([]);
    }
  }, [chat, t]);

  const { messages, sendMessage } = useChat(senderId);

  useEffect(() => {
    setAllMessages((prevMessages) => [...prevMessages, ...messages]);
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    event.target.value = '';
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload file');
      }

      const data = await response.json();

      const newMessage: ChatMessage = {
        chatId: chat!.id,
        senderId,
        recipientId,
        message: message.trim(),
        fileUrl: data.url,
        timestamp: new Date(),
      };

      setAllMessages((prev) => [...prev, newMessage]);
      sendMessage(chat!.id, recipientId, message.trim(), data.url);

      setMessage('');
      setFile(null);
      setShowEmojis(false);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(t('error-uploading-file'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() || file) {
      if (file) {
        handleFileUpload();
      } else {
        const newMessage: ChatMessage = {
          chatId: chat!.id,
          senderId,
          recipientId,
          message: message.trim(),
          timestamp: new Date(),
        };
        setAllMessages((prev) => [...prev, newMessage]);
        sendMessage(chat!.id, recipientId, message.trim());
        setMessage('');
        setShowEmojis(false);
        setTimeout(scrollToBottom, 100);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const groupMessagesByDate = () => {
    if (!allMessages.length) return [];

    const groups: { date: string; messages: ChatMessage[] }[] = [];
    let currentDate = '';
    let currentGroup: ChatMessage[] = [];

    const locale = language === 'es' ? es : language === 'ca' ? ca : undefined;

    allMessages.forEach((msg) => {
      const messageDate = msg.timestamp ? new Date(msg.timestamp) : new Date();
      const formattedDate = format(messageDate, 'MMMM d, yyyy', { locale });
      const capitalizedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      if (capitalizedDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = capitalizedDate;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop() || '';
      return decodeURIComponent(fileName);
    } catch {
      return url.split('/').pop() || '';
    }
  };

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'txt':
        return <FileText className="h-6 w-6 text-gray-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const renderFileContent = (fileUrl: string, isSender: boolean) => {
    if (isImageFile(fileUrl)) {
      return (
        <div className="mt-2">
          <div className="relative aspect-[4/3] w-full max-w-md cursor-pointer overflow-hidden rounded-lg">
            <Image
              src={fileUrl}
              alt="Shared image"
              width={400}
              height={300}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain transition-transform hover:scale-[1.02]"
              onClick={() => setSelectedImage(fileUrl)}
            />
          </div>
          <a
            href={fileUrl}
            download={getFileNameFromUrl(fileUrl)}
            className={`${isSender ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-[#15b7b9]'} mt-2 flex items-center gap-2 text-sm hover:underline`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={16} />
            {t('download-file')}
          </a>
        </div>
      );
    }

    const fileName = getFileNameFromUrl(fileUrl);
    const fileExtension = fileName.split('.').pop()?.toUpperCase() || '';

    return (
      <div className="mt-2">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50">
          <div className="flex-shrink-0">{getFileIcon(fileUrl)}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {fileName}
            </p>
            <p className="text-xs text-gray-500">
              {fileExtension} • {t('view-document')}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#15b7b9]"
            >
              <FileText size={18} />
            </a>
            <a
              href={fileUrl}
              download={getFileNameFromUrl(fileUrl)}
              className="flex-shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#15b7b9]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={18} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {isLoading ? (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Spinner className="h-12 w-12 text-[#15b7b9]" />
          <p className="text-lg font-medium text-gray-600">
            {t('loading-chat')}
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {!chatId ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#e3f8f8]">
                  <MessageSquareOff className="h-12 w-12 text-[#15b7b9]" />
                </div>
                <h1 className="text-xl font-semibold text-gray-700">
                  {t('no-chats-yet')}
                </h1>
                <p className="mt-2 text-gray-500">{t('start-conversation')}</p>
              </div>
            </div>
          ) : !chat ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#e3f8f8]">
                  <MessageSquareWarning className="h-12 w-12 text-[#15b7b9]" />
                </div>
                <h1 className="text-xl font-semibold text-gray-700">
                  {t('chat-not-found')}
                </h1>
                <p className="mt-2 text-gray-500">
                  {t('chat-not-found-description')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  {getAvatar(12, imageUrl, displayName)}
                  <div>
                    <h2 className="font-medium">{displayName}</h2>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {messageGroups.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e3f8f8]">
                      <MessageSquareOff className="h-12 w-12 text-[#15b7b9]" />
                    </div>
                    <p className="text-center text-gray-500">
                      {t('no-messages-yet')}
                    </p>
                    <p className="text-center text-sm text-gray-400">
                      {t('start-conversation')}
                    </p>
                  </div>
                ) : (
                  messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6">
                      <div className="mb-4 flex justify-center">
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                          {group.date}
                        </span>
                      </div>

                      {group.messages.map((chatMessage, index) => {
                        const isSender = chatMessage.senderId === senderId;
                        const showAvatar =
                          index === 0 ||
                          group.messages[index - 1]?.senderId !==
                            chatMessage.senderId;

                        const locale =
                          language === 'es'
                            ? es
                            : language === 'ca'
                              ? ca
                              : undefined;

                        return (
                          <div
                            key={index}
                            className={`mb-4 flex ${isSender ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`${
                                chatMessage.bookingMetadata
                                  ? 'w-full max-w-3xl'
                                  : 'max-w-[75%]'
                              } ${isSender ? 'order-2' : 'order-1'}`}
                            >
                              {chatMessage.bookingMetadata ? (
                                <BookingNotification
                                  metadata={chatMessage.bookingMetadata}
                                  language={language}
                                />
                              ) : (
                                <div
                                  className={`rounded-2xl px-4 py-2 ${
                                    isSender
                                      ? 'rounded-tr-none bg-[#15b7b9] text-white'
                                      : 'rounded-tl-none bg-white text-gray-800'
                                  } shadow-sm`}
                                >
                                  {chatMessage.message}
                                  {chatMessage.fileUrl &&
                                    renderFileContent(
                                      chatMessage.fileUrl,
                                      chatMessage.senderId === senderId,
                                    )}
                                </div>
                              )}
                              <div
                                className={`mt-2 text-xs text-gray-500 ${isSender ? 'text-right' : 'text-left'}`}
                              >
                                {chatMessage.timestamp &&
                                  format(
                                    new Date(chatMessage.timestamp),
                                    'h:mm a',
                                    { locale },
                                  )}
                              </div>
                            </div>

                            {!isSender && showAvatar && (
                              <div className="order-0 mr-2">
                                {getAvatar(12, imageUrl, displayName)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t bg-white p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Paperclip size={22} />
                  </button>
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{file.name}</span>
                      <button
                        onClick={() => setFile(null)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      ref={messageInputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={t('type-a-message')}
                      className="w-full rounded-full border border-gray-200 py-3 pl-4 focus:border-[#15b7b9] focus:outline-none focus:ring-1 focus:ring-[#15b7b9]"
                    />
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-12 right-0 z-50"
                    >
                      {showEmojis && (
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={350}
                          height={400}
                          searchDisabled={false}
                          skinTonesDisabled={true}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => setShowEmojis(!showEmojis)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-200 ${
                        showEmojis
                          ? 'bg-[#15b7b9] text-white'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-[#15b7b9]'
                      }`}
                      title={t('add-emoji')}
                    >
                      <Smile
                        size={24}
                        className="transition-transform duration-200 hover:scale-110"
                      />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={(!message.trim() && !file) || isUploading}
                    className={`rounded-full p-3 text-white transition-all ${
                      (message.trim() || file) && !isUploading
                        ? 'bg-[#15b7b9] hover:bg-[#109a9c]'
                        : 'bg-gray-300'
                    }`}
                  >
                    {isUploading ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <div className="relative inline-block">
            <Image
              src={selectedImage}
              alt="Full size image"
              width={1200}
              height={800}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
              quality={100}
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
