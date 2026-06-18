import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
// 💡 ලයිව් අප්ඩේට්ස් සඳහා අලුත් useEcho hook එක
import { useEcho } from '@laravel/echo-react';

interface User {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: string | number;
    image_path: string;
}

interface Conversation {
    id: number;
    buyer_id: number;
    seller_id: number;
    buyer: User;
    seller: User;
    product: Product | null;
    last_message: string | null;
    unread_count: number;
    updated_at?: string;
}

interface InboxProps {
    conversations: Conversation[];
}

export default function Inbox({
    conversations: initialConversations,
}: InboxProps) {
    const { auth } = usePage<any>().props;
    const currentUserId = auth?.user?.id;

    // ලයිව් අප්ඩේට්ස් හැන්ඩ්ල් කරන්න ස්ටේට් එකක් ගන්නවා
    const [localConversations, setLocalConversations] = useState<
        Conversation[]
    >(initialConversations || []);

    useEffect(() => {
        setLocalConversations(initialConversations || []);
    }, [initialConversations]);

    // =========================================================================
    // 💡 ගෝලීය යූසර් චැනල් එකට සවන් දී එසැණින් Inbox එක අප්ඩේට් කිරීම (New & Existing Chats)
    // =========================================================================
    try {
        // 1. පවතින චැට් වලට අලුත් මැසේජ් එද්දී හෝ මැසේජ් එකක් එක්කම අලුත් චැට් එකක් එද්දී අප්ඩේට් වෙන ලොජික් එක
        useEcho(
            `user.${currentUserId}`,
            'MessageSent',
            (e: any) => {
                console.log('🔔 New Message Event Received in Inbox:', e);

                // Laravel Event එකෙන් එන මුල්ම message object එක (App\Events\MessageSent වල public $message එක)
                const incomingMessageObj = e.message || e;

                if (!incomingMessageObj) return;

                // 💡 වැදගත්: ඩේටාබේස් එකේ column එක 'message' නිසා පෙළ (text) එක තියෙන්නේ incomingMessageObj.message ඇතුළේ
                const messageText = incomingMessageObj.message;
                const conversationId = incomingMessageObj.conversation_id;
                // Laravel එකේ load කරපු conversation එක
                const incomingConversation = incomingMessageObj.conversation;

                setLocalConversations((prevConversations) => {
                    const conversationExists = prevConversations.some(
                        (chat) => chat.id === conversationId,
                    );

                    if (conversationExists) {
                        // 🔄 පවතින චැට් එකක් නම්: ඒක අප්ඩේට් කරලා ලිස්ට් එකේ උඩටම (Top) ගන්නවා
                        const updatedConversations = prevConversations.map(
                            (chat) => {
                                if (chat.id === conversationId) {
                                    return {
                                        ...chat,
                                        last_message: messageText, // පිරිසිදු string text එක මෙතනට දානවා
                                        unread_count:
                                            Number(chat.unread_count || 0) + 1,
                                        updated_at:
                                            incomingMessageObj.created_at,
                                    };
                                }
                                return chat;
                            },
                        );

                        // Sort: අලුත්ම මැසේජ් ආපු එක උඩටම ගන්නවා
                        return [...updatedConversations].sort((a, b) => {
                            const timeA = a.updated_at
                                ? new Date(a.updated_at).getTime()
                                : 0;
                            const timeB = b.updated_at
                                ? new Date(b.updated_at).getTime()
                                : 0;
                            return timeB - timeA;
                        });
                    } else {
                        // 🔴 දැනට ලිස්ට් එකේ නැති (අලුත්ම මැසේජ් එකක් එක්ක ආපු) චැට් එකක් නම්:
                        if (!incomingConversation) return prevConversations;

                        const newConversation: Conversation = {
                            id: incomingConversation.id,
                            buyer_id: incomingConversation.buyer_id,
                            seller_id: incomingConversation.seller_id,
                            buyer: incomingConversation.buyer,
                            seller: incomingConversation.seller,
                            product: incomingConversation.product,
                            last_message: messageText,
                            unread_count: 1, // අලුත් එකක් නිසා සෙලර්ට 1යි
                            updated_at:
                                incomingMessageObj.created_at ||
                                new Date().toISOString(),
                        };

                        return [newConversation, ...prevConversations];
                    }
                });
            },
            [currentUserId],
            'private',
        );

        // 2. හිස් චැට් එකක් (මැසේජ් එකක් නැතුව) පටන් ගත්ත ගමන් Card එක වැටෙන ලොජික් එක
        useEcho(
            `user.${currentUserId}`,
            'ConversationCreated',
            (e: any) => {
                console.log('🆕 New Conversation Created Event Received:', e);

                const newChatData = e.conversation || e;

                if (!newChatData) return;

                setLocalConversations((prevConversations) => {
                    const isAlreadyInList = prevConversations.some(
                        (chat) => chat.id === newChatData.id,
                    );
                    if (isAlreadyInList) return prevConversations;

                    const newConversation: Conversation = {
                        id: newChatData.id,
                        buyer_id: newChatData.buyer_id,
                        seller_id: newChatData.seller_id,
                        buyer: newChatData.buyer,
                        seller: newChatData.seller,
                        product: newChatData.product,
                        last_message:
                            newChatData.last_message ||
                            'Started a conversation...',
                        unread_count:
                            typeof newChatData.unread_count === 'number'
                                ? newChatData.unread_count
                                : 0,
                        updated_at:
                            newChatData.updated_at || new Date().toISOString(),
                    };

                    return [newConversation, ...prevConversations];
                });
            },
            [currentUserId],
            'private',
        );
    } catch (error) {
        console.error('❌ Inbox Echo Error:', error);
    }
    // =========================================================================

    return (
        <>
            <Head title="Messages - SnapMarket" />

            {/* Wrapper */}
            <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 px-4 py-6 text-gray-800 sm:px-6 sm:py-10 lg:px-8">
                <div className="flex w-full max-w-5xl flex-col space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                            Your Inbox
                        </h1>
                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm">
                            {localConversations.length}{' '}
                            {localConversations.length === 1
                                ? 'Conversation'
                                : 'Conversations'}
                        </span>
                    </div>

                    {localConversations.length === 0 ? (
                        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
                            <p className="text-sm text-gray-400 sm:text-base">
                                No conversations found yet. 💬
                            </p>
                        </div>
                    ) : (
                        <div className="flex w-full flex-col divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            {localConversations.map((chat) => {
                                const partner =
                                    chat.buyer_id === currentUserId
                                        ? chat.seller
                                        : chat.buyer;
                                const isUnread = chat.unread_count > 0;

                                return (
                                    <Link
                                        key={chat.id}
                                        href={`/chat/${chat.id}`}
                                        className={`flex w-full items-center justify-between p-4 transition duration-150 hover:bg-indigo-50/20 sm:p-5 ${isUnread ? 'bg-indigo-50/40 font-medium' : ''}`}
                                    >
                                        {/* වම් පැත්ත: Avatar එක සහ මැසේජ් විස්තර */}
                                        <div className="flex min-w-0 flex-1 items-center space-x-4 pr-4">
                                            {/* User Avatar */}
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-indigo-200/50 bg-indigo-100 font-bold text-indigo-700 uppercase shadow-sm">
                                                {partner?.name?.charAt(0) ||
                                                    'U'}
                                            </div>

                                            {/* Chat Details */}
                                            <div className="min-w-0 flex-1">
                                                <h2
                                                    className={`mb-0.5 truncate text-sm sm:text-base ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}
                                                >
                                                    {partner?.name ||
                                                        'Unknown User'}
                                                </h2>
                                                <p
                                                    className={`max-w-[280px] truncate text-xs sm:max-w-xl sm:text-sm lg:max-w-2xl ${isUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}
                                                >
                                                    {chat.last_message
                                                        ? chat.last_message
                                                        : 'Started a conversation...'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* දකුණු පැත්ත: Notification Icon සහ Product Image */}
                                        <div className="flex flex-shrink-0 items-center space-x-4">
                                            {/* Live Pending Messages Count Icon */}
                                            {isUnread && (
                                                <span className="inline-flex h-5 min-w-[22px] animate-pulse items-center justify-center rounded-full border border-white bg-indigo-600 px-2.5 py-1 text-xs leading-none font-bold text-white shadow-sm">
                                                    {chat.unread_count}
                                                </span>
                                            )}

                                            {/* Product Image Preview */}
                                            {chat.product && (
                                                <div className="hidden h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200/80 bg-gray-50 sm:block">
                                                    <img
                                                        src={chat.product.image_path}
                                                        alt={chat.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
