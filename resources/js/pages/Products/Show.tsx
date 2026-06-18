import { Head, Link, router, usePage } from '@inertiajs/react'; // 👈 usePage එකතු කළා
import { Button } from '@/components/ui/button';
import { useEffect } from 'react'; // 👈 useEffect එකතු කළා
import { toast, Toaster } from 'sonner'; // 👈 ඔයාගේ package.json එකේ තියෙන Sonner එක ඉම්පෝර්ට් කළා

interface User {
    name: string;
}

interface Category {
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: string | number;
    description: string;
    image_path: string;
    user: User;
    category: Category;
}

interface ShowProps {
    product: Product;
}

export default function Show({ product }: ShowProps) {
    // 💡 Inertia Shared Props වලින් flash ඩේටා ටික ගන්නවා
    const { flash } = usePage<any>().props;

    // 💡 Backend එකෙන් flash error එකක් ආපු ගමන් Toast එක Trigger කරනවා
    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error, {
                position: 'top-right',
                duration: 4000,
            });
        }
        if (flash?.success) {
            toast.success(flash.success, {
                position: 'top-right',
                duration: 4000,
            });
        }
    }, [flash]);

    return (
        <>
            <Head title={`${product.name} - SnapMarket`} />

            {/* 💡 UI එක උඩින් Toast ඇලර්ට් එක පෙනෙන්න මේ කම්පෝනන්ට් එක අනිවාර්යයි */}
            <Toaster richColors />

            <div className="min-h-screen bg-gray-50 pb-12 text-gray-800">
                {/* NAVBAR */}
                <nav className="mb-8 flex h-16 items-center bg-white shadow-sm">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="text-2xl font-black tracking-wider text-indigo-600"
                        >
                            SnapMarket
                        </Link>
                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-500 hover:text-gray-900"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </nav>

                {/* PRODUCT DETAILS CONTAINER */}
                <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
                        {/* Left Column: Image */}
                        <div className="aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            <img
                                src={product.image_path}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Right Column: Information */}
                        <div className="flex flex-col justify-between">
                            <div>
                                {/* Category Badge */}
                                <span className="mb-4 inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                    {product.category?.name}
                                </span>

                                {/* Product Name */}
                                <h1 className="mb-2 text-2xl font-bold text-gray-950 md:text-3xl">
                                    {product.name}
                                </h1>

                                {/* Price */}
                                <p className="mb-6 text-2xl font-black text-indigo-600">
                                    LKR {Number(product.price).toLocaleString()}
                                </p>

                                <hr className="my-4 border-gray-100" />

                                {/* Description */}
                                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                                    Description
                                </h3>
                                <p className="mb-6 text-sm leading-relaxed whitespace-pre-line text-gray-600">
                                    {product.description ||
                                        'No description provided for this product.'}
                                </p>
                            </div>

                            {/* Seller Card & Chat Button */}
                            <div className="mt-auto rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                            Listed By
                                        </p>
                                        <p className="text-sm font-bold text-gray-800">
                                            {product.user?.name}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="mt-3 flex w-full items-center justify-center space-x-2 text-shadow-gray-300 hover:text-shadow-gray-400"
                                    onClick={() =>
                                        router.post(`/chat/start/${product.id}`)
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    <span>Chat with Seller</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
