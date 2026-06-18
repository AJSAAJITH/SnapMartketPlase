import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
// 💡 අලුත් `@laravel/echo-react` පැකේජයෙන් useEcho Hook එක Import කරගැනීම
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
    product: Product | null; // 💡 Null වෙන්න පුළුවන් විදිහට හැදුවා
}

interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    message: string;
    created_at: string;
    sender: User;
}

interface ShowProps {
    conversation: Conversation;
    messages: Message[];
}

export default function Show({
    conversation,
    messages: initialMessages,
}: ShowProps) {
    const { auth } = usePage<any>().props;
    const currentUserId = auth?.user?.id;

    // 💡 ආරක්ෂාව: conversation එක නැත්නම් හෝ user නැත්නම් ක්‍රෑෂ් නොවී බේරෙන්න
    if (!conversation || !currentUserId) {
        return (
            <div className="p-8 text-center text-red-500">
                Invalid conversation data or session expired.
            </div>
        );
    }

    const chatPartner =
        conversation.buyer_id === currentUserId
            ? conversation.seller
            : conversation.buyer;
    const messageEndRef = useRef<HTMLDivElement>(null);

    const [localMessages, setLocalMessages] = useState<Message[]>(
        initialMessages || [],
    );

    useEffect(() => {
        setLocalMessages(initialMessages || []);
    }, [initialMessages]);

    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    // =========================================================================
    // 💡 Echo Listener එක ආරක්ෂිතව සිද්ධ කරන කොටස (Real-time Messaging Setup)
    // =========================================================================
    try {
        useEcho(
            `chat.${conversation.id}`, // Reverb එක හරහා සම්බන්ධ වන Private Channel එක
            'MessageSent', // Laravel Backend එකෙන් Broadcast කරන Event එකේ නම
            (e: { message: Message }) => {
                console.log('📩 Real-time message received:', e);

                // 💡 ආරක්ෂිත පියවරක්: එකම මැසේජ් එක කිසියම් හේතුවකින් (Duplicate) දෙපාරක් වැටීම වැළැක්වීම
                setLocalMessages((prevMessages) => {
                    if (prevMessages.some((msg) => msg.id === e.message.id)) {
                        return prevMessages;
                    }
                    return [...prevMessages, e.message];
                });
            },
            [conversation.id], // Conversation ID එක වෙනස් වෙද්දී Listener එක අලුත් වීමට (Dependency)
            'private', // Laravel Echo එකට මේක Private Channel එකක් බව හැඟවීමට
        );
    } catch (error) {
        console.error('❌ Echo Listener Error handled:', error);
    }
    // =========================================================================

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.message.trim()) return;

        post(`/chat/${conversation.id}/message`, {
            onSuccess: () => reset('message'),
        });
    };

    // 💡 Product Price එක Number එකක් බව 100% ක් සහතික කරගන්නා ආරක්ෂිත ශ්‍රිතය
    const formatPrice = (price: any) => {
        if (!price) return '0';
        const num = Number(price);
        return isNaN(num) ? '0' : num.toLocaleString();
    };

    return (
        <>
            <Head
                title={`Chat with ${chatPartner?.name || 'User'} - SnapMarket`}
            />

            <div
                className="flex w-full flex-col overflow-hidden bg-gray-50 text-gray-800"
                style={{ height: '100vh', maxHeight: '100vh' }}
            >
                {/* TOP NAVBAR */}
                <nav className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/chat"
                            className="flex items-center space-x-1 text-gray-500 hover:text-gray-900"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="hidden text-sm font-medium sm:inline">
                                Inbox
                            </span>
                        </Link>
                        <div className="h-6 border-l border-gray-200 pl-4">
                            <h1 className="line-clamp-1 text-sm font-bold text-gray-900 sm:text-base">
                                {chatPartner?.name || 'Unknown User'}
                            </h1>
                        </div>
                    </div>

                    {/* Product Mini Banner */}
                    {conversation.product && (
                        <div className="flex max-w-[150px] items-center space-x-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1.5 pr-4 sm:max-w-md">
                            <img
                                src={conversation.product.image_path}
                                alt={conversation.product.name}
                                className="h-8 w-8 flex-shrink-0 rounded-lg object-cover"
                            />
                            <div className="hidden text-left sm:block">
                                <p className="line-clamp-1 text-xs font-semibold text-gray-900">
                                    {conversation.product.name}
                                </p>
                                <p className="text-[11px] font-bold text-indigo-600">
                                    LKR{' '}
                                    {formatPrice(conversation.product.price)}
                                </p>
                            </div>
                        </div>
                    )}
                </nav>

                {/* MESSAGES LOG */}
                <div
                    className="flex w-full flex-col overflow-y-auto bg-gray-50 p-4 sm:p-6"
                    style={{ height: 'calc(100vh - 144px)' }}
                >
                    {localMessages.length === 0 ? (
                        <div className="my-auto py-12 text-center text-gray-400">
                            <p className="text-sm">
                                No messages yet. Say hello! 👋
                            </p>
                        </div>
                    ) : (
                        <div className="mt-auto space-y-4">
                            {localMessages.map((msg) => {
                                const isMe = msg.sender_id === currentUserId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-md ${isMe
                                                    ? 'rounded-br-none bg-indigo-600 text-white'
                                                    : 'rounded-bl-none border border-gray-100 bg-white text-gray-900'
                                                }`}
                                        >
                                            <p className="leading-relaxed break-words">
                                                {msg.message}
                                            </p>
                                            <span
                                                className={`mt-1 block text-right text-[9px] ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}
                                            >
                                                {msg.created_at
                                                    ? new Date(
                                                        msg.created_at,
                                                    ).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                    : ''}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div ref={messageEndRef} />
                </div>

                {/* BOTTOM MESSAGE INPUT BAR */}
                <div className="flex h-20 flex-shrink-0 items-center border-t border-gray-100 bg-white p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto flex w-full max-w-4xl items-center space-x-3"
                    >
                        <input
                            type="text"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Type a message..."
                            disabled={processing}
                            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={processing || !data.message.trim()}
                            className="flex-shrink-0 rounded-xl bg-indigo-600 p-2.5 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 rotate-90 transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
