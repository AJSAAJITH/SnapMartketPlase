import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// 1. Backend එකෙන් එන දත්ත වල ව්‍යුහය (Types)
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

interface WelcomeProps {
    products: Product[];
}

export default function Welcome({ products }: WelcomeProps) {
    // 2. ලාරාවෙල් බැක්-එන්ඩ් එකෙන් එවන Flash Messages සහ Auth දත්ත කියවා ගැනීම
    const { auth, flash } = usePage().props as any;

    // Alert එක පාලනය කරන State එක
    const [showAlert, setShowAlert] = useState(false);

    // Flash Message එකක් ආපු ගමන් Alert එක තත්පර 4කට පෙන්වන්න ක්‍රියාත්මක වන කොටස
    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <>
            <Head title="SnapMarket - Home" />

            <div className="min-h-screen bg-gray-50 text-gray-800">
                {/* 🌟 1. සාර්ථක වුණාම උඩින්ම පාවෙලා එන Success Alert එක */}
                {showAlert && flash?.success && (
                    <div className="fixed top-5 right-5 z-50 flex animate-bounce items-center space-x-2 rounded-lg bg-emerald-500 px-6 py-3 text-white shadow-xl">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {/* NAVBAR SECTION */}
                <nav className="sticky top-0 z-40 bg-white shadow-sm">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            <span className="text-2xl font-black tracking-wider text-indigo-600">
                                SnapMarket
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <>
                                    {/* ලොග් වෙලා ඉන්න අයට ප්‍රොඩක්ට් එකක් දාන්න යන්න බටන් එක */}
                                    <Link
                                        href={'/products/create'}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                                    >
                                        + Sell Product
                                    </Link>
                                    <Link
                                        href={'/dashboard'}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={'/login'}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={'/register'}
                                        className="rounded-md border border-indigo-600 px-4 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* HERO SECTION */}
                <header className="mb-10 border-b bg-white py-12">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            Discover Awesome Products
                        </h1>
                        <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500">
                            Buy and sell anything instantly on Sri Lanka's
                            modern micro-marketplace.
                        </p>
                    </div>
                </header>

                {/* 🛒 2. PRODUCT GRID SECTION */}
                <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                            <p className="text-lg text-gray-500">
                                No products available yet. Be the first to list
                                one!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:shadow-md"
                                >
                                    {/* Product Image */}
                                    <div className="relative aspect-square bg-gray-100">
                                        <Link href={`/products/${product.id}`}>
                                            <img
                                                src={product.image_path} // 👈 /app/public කෑල්ල අයින් කලා
                                                alt={product.name}
                                                className="h-full w-full object-cover p-1"
                                            />
                                        </Link>

                                        {/* Category Badge */}
                                        <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                                            {product.category?.name}
                                        </span>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex flex-grow flex-col p-4">
                                        <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-900">
                                            <Link
                                                href={`/products/${product.id}`}
                                            >
                                                {product.name}
                                            </Link>
                                        </h3>

                                        <p className="mb-2 text-lg font-bold text-indigo-600">
                                            LKR{' '}
                                            {Number(
                                                product.price,
                                            ).toLocaleString()}
                                        </p>

                                        <p className="mb-4 line-clamp-2 flex-grow text-xs text-gray-500">
                                            {product.description ||
                                                'No description provided.'}
                                        </p>

                                        {/* Seller Info */}
                                        <div className="mt-auto flex items-center justify-between border-t pt-3 text-[11px] text-gray-400">
                                            <span>By {product.user?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
