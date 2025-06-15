'use client';
import React, { useEffect, useRef, useState } from 'react';
import { SocketMessage, useChat } from '@/hooks/useSocket';
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
import { useRouter } from 'next/navigation';
import { ChatHistory } from '@/service/backend/chat/domain/chatHistory';
import {
  createNewChat,
  getChatById,
} from '@/service/backend/chat/service/chat.service';
import { getAvatar } from '@/components/shared/avatar';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import { Spinner } from '@/components/shared/spinner';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { fetchArtistById } from '@/service/backend/artist/service/artist.service';
import BookingNotification from './bookingNotification';
import { toast } from 'react-hot-toast';

interface ChatProps {
  language: string;
  userChats: ChatView[];
  setChats: React.Dispatch<React.SetStateAction<ChatView[]>>;
  chatId?: string;
  bandId?: string;
}

const Chat: React.FC<ChatProps> = ({
  language,
  userChats,
  setChats,
  chatId,
  bandId,
}) => {
  const { t } = useTranslation(language, 'chat');
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [allMessages, setAllMessages] = useState<SocketMessage[]>([]);
  const [chat, setChat] = useState<ChatHistory | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [senderId, setSenderId] = useState<string>('');
  const [recipientId, setRecipientId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | undefined>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  const { messages, sendMessage } = useChat(senderId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const createEmptyChat = async (
    bandId: string,
  ): Promise<ChatHistory | undefined> => {
    if (!bandId) {
      setError(t('band-id-required'));
      return;
    }

    const [userInfo, band] = await Promise.all([
      getUserInfo().catch((err: Error) => {
        throw err;
      }),
      fetchArtistById(bandId).catch((err: Error) => {
        throw err;
      }),
    ]);

    if (!userInfo) {
      setError(t('failed-to-get-user'));
      return;
    }
    if (!band || 'error' in band) {
      setError(t('band-not-found'));
      return;
    }
    const now = new Date();
    return {
      id: crypto.randomUUID(),
      createdAt: now,
      messages: [],
      user: userInfo,
      band: band,
      updatedAt: now,
    };
  };

  useEffect(() => {
    if (chatId) {
      getChatById(chatId).then((chat: ChatHistory | undefined) => {
        console.log(chat);
        setIsLoading(false);
        setChat(chat);
      });
    } else if (bandId) {
      const existingChat = userChats.find((chat) => chat.band.id === bandId);
      if (existingChat) {
        getChatById(existingChat.id).then((chat: ChatHistory | undefined) => {
          setIsLoading(false);
          setChat(chat);
        });
      } else {
        setIsNewChat(true);
        createEmptyChat(bandId).then((chat) => {
          setChat(chat);
          setIsLoading(false);
        });
      }
    } else {
      setError(t('chat-or-band-id-required'));
    }
  }, [chatId, bandId]);

  useEffect(() => {
    if (chat) {
      const newSenderId = chat.user.id;
      const newRecipientId = chat.band.id;
      const newImageUrl = chat.band?.imageUrl;
      const newDisplayName = chat.band?.name || t('unknown');

      setSenderId(newSenderId);
      setRecipientId(newRecipientId);
      setImageUrl(newImageUrl);
      setDisplayName(newDisplayName);

      setAllMessages(
        chat.messages.map((msg) => ({
          id: msg.id,
          chatId: chat.id,
          senderId: msg.senderId ?? newSenderId,
          recipientId: msg.recipientId ?? newRecipientId,
          message: msg.message ?? '',
          timestamp: msg.timestamp ?? new Date(),
          bookingMetadata: msg.bookingMetadata
            ? {
                ...msg.bookingMetadata,
                eventDate: msg.bookingMetadata.eventDate
                  ? new Date(msg.bookingMetadata.eventDate)
                  : undefined,
              }
            : undefined,
          fileUrl: msg.fileUrl,
        })),
      );
      setTimeout(scrollToBottom, 100);
    }
  }, [chat, t]);

  useEffect(() => {
    if (messages.length > 0 && chat) {
      const newMessages = messages.filter(
        (msg) => !allMessages.some((existingMsg) => existingMsg.id === msg.id),
      );

      if (newMessages.length > 0) {
        setAllMessages((prevMessages) => [...prevMessages, ...newMessages]);
        setTimeout(scrollToBottom, 100);

        const updatedChat: ChatView = {
          ...chat,
          messages: [...chat.messages, ...newMessages],
          updatedAt: new Date(),
          unreadMessagesCount: 0,
        };
        setChat(updatedChat);
        setChats((prevChats: ChatView[]) => {
          const otherChats = prevChats.filter((c) => c.id !== chat.id);
          return [updatedChat, ...otherChats];
        });
      }
    }
  }, [messages, chat, setChats]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      if (
        selectedFile.type.startsWith('image/') ||
        selectedFile.type.startsWith('video/')
      ) {
        const previewUrl = URL.createObjectURL(selectedFile);
        setFilePreview(previewUrl);
      } else {
        setFilePreview(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

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

      const newMessage: SocketMessage = {
        id: crypto.randomUUID(),
        chatId: chat!.id,
        senderId,
        recipientId,
        message: message.trim(),
        fileUrl: data.url,
        timestamp: new Date(),
      };

      setAllMessages((prev) => [...prev, newMessage]);
      sendMessage(chat!.id, recipientId, message.trim(), data.url);

      if (chat) {
        const updatedChat: ChatView = {
          ...chat,
          messages: [...chat.messages, newMessage],
          updatedAt: new Date(),
          unreadMessagesCount: 0,
        };
        setChat(updatedChat);
        setChats((prevChats: ChatView[]) => {
          const otherChats = prevChats.filter((c) => c.id !== chat.id);
          return [updatedChat, ...otherChats];
        });
      }

      setMessage('');
      setFile(null);
      setShowEmojis(false);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(t('error-uploading-file'));
    }
  };

  const handleSendMessage = () => {
    if (message.trim() || file) {
      if (isNewChat) {
        createNewChat(bandId!).then((chatId) => {
          if (chatId) {
            getChatById(chatId).then((createdChat: ChatHistory | undefined) => {
              if (createdChat) createMessageAndSendIt(createdChat);
            });
          }
        });
      } else {
        if (chat) createMessageAndSendIt(chat);
      }
    }
  };

  const createMessageAndSendIt = (createdChat: ChatHistory) => {
    if (file) {
      handleFileUpload();
    } else {
      const newMessage: SocketMessage = {
        id: crypto.randomUUID(),
        chatId: createdChat.id,
        senderId,
        recipientId,
        message: message.trim(),
        timestamp: new Date(),
      };
      setAllMessages((prev) => [...prev, newMessage]);
      sendMessage(createdChat.id, recipientId, message.trim());

      const updatedChat: ChatView = {
        ...createdChat,
        messages: [...createdChat.messages, newMessage],
        updatedAt: new Date(),
        unreadMessagesCount: 0,
      };
      setChat(updatedChat);
      setChats((prevChats: ChatView[]) => {
        const otherChats = prevChats.filter((c) => c.id !== createdChat.id);
        return [updatedChat, ...otherChats];
      });

      setMessage('');
      setShowEmojis(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const groupMessagesByDate = () => {
    if (!allMessages.length) return [];

    const groups: { date: string; messages: SocketMessage[] }[] = [];
    let currentDate = '';
    let currentGroup: SocketMessage[] = [];

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

  const goToChats = () => {
    router.push(`/${language}/chats`);
  };

  const goToBandProfile = () => {
    if (chat?.band.id) {
      router.push(`/${language}/artists/${chat.band.id}`);
    }
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

  const isVideoFile = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
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

  const renderFileContent = (fileUrl: string) => {
    if (isImageFile(fileUrl)) {
      return (
        <div className="mt-2">
          <img
            src={fileUrl}
            alt="Shared image"
            className="max-h-64 cursor-pointer rounded-lg object-contain transition-transform hover:scale-[1.02]"
            onClick={() => setSelectedImage(fileUrl)}
          />
          <a
            href={fileUrl}
            download={getFileNameFromUrl(fileUrl)}
            className="mt-2 flex items-center gap-2 text-sm text-white hover:text-gray-200 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={16} />
            {t('download-file')}
          </a>
        </div>
      );
    }

    if (isVideoFile(fileUrl)) {
      return (
        <div className="mt-2">
          <video src={fileUrl} controls className="max-h-64 rounded-lg">
            Your browser does not support the video tag.
          </video>
          <a
            href={fileUrl}
            download={getFileNameFromUrl(fileUrl)}
            className="mt-2 flex items-center gap-2 text-sm text-white hover:text-gray-200 hover:underline"
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
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
        >
          <div className="flex-shrink-0">{getFileIcon(fileUrl)}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {fileName}
            </p>
            <p className="text-xs text-gray-500">
              {fileExtension} • {t('view-document')}
            </p>
          </div>
          <a
            href={fileUrl}
            download={getFileNameFromUrl(fileUrl)}
            className="flex-shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#15b7b9]"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={18} />
          </a>
        </a>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <MessageSquareWarning className="h-12 w-12 text-[#15b7b9]" />
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex h-full flex-col">
      {isLoading ? (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Spinner className="h-12 w-12 text-[#15b7b9]" />
          <p className="text-lg font-medium text-gray-600">
            {t('loading-chat')}
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {!chat ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-700">
                  {t('chat-not-found')}
                </h1>
                <button
                  onClick={goToChats}
                  className="mt-4 rounded-md bg-[#15b7b9] px-4 py-2 text-white"
                >
                  {t('back-to-chats')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-4rem)] flex-col">
              <div className="flex items-center justify-between border-b bg-white p-4 shadow-sm">
                <div
                  className="flex cursor-pointer items-center gap-3"
                  onClick={goToBandProfile}
                >
                  {getAvatar(12, imageUrl, displayName)}
                  <div>
                    <h2 className="font-medium">{displayName}</h2>
                  </div>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto bg-gray-50 p-4"
              >
                {messageGroups.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e3f8f8]">
                      <MessageSquareOff className="h-12 w-12 text-[#15b7b9]" />
                    </div>
                    <p className="text-center text-gray-500">
                      {t('no-messages-yet')}
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
                        const isSender = chatMessage.senderId === chat?.user.id;
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
                                chatMessage.bookingMetadata?.bookingId
                                  ? 'w-full max-w-3xl'
                                  : 'max-w-[75%]'
                              } ${isSender ? 'order-2' : 'order-1'}`}
                            >
                              {chatMessage.bookingMetadata ? (
                                <BookingNotification
                                  metadata={{
                                    ...chatMessage.bookingMetadata,
                                    eventDate: chatMessage.bookingMetadata
                                      .eventDate
                                      ? new Date(
                                          chatMessage.bookingMetadata.eventDate,
                                        ).toISOString()
                                      : undefined,
                                  }}
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
                                    renderFileContent(chatMessage.fileUrl)}
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

              <div className="border-t bg-white p-4 pb-8">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
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
                        onClick={removeFile}
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
                    disabled={!message.trim() && !file}
                    className={`rounded-full p-3 text-white transition-all ${
                      message.trim() || file
                        ? 'bg-[#15b7b9] hover:bg-[#109a9c]'
                        : 'bg-gray-300'
                    }`}
                  >
                    <Send size={18} />
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
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
