import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

// 1. Backend එකෙන් එන Category දත්ත වල ව්‍යුහය (Type Definition)
interface Category {
    id: number;
    name: string;
}
interface CreateProps {
    categories: Category[];
}

export default function Create({ categories }: CreateProps) {
    // ලාරාවෙල් බැක්-එන්ඩ් එකෙන් එවන Flash Messages (Props) කියවා ගැනීම
    const { flash } = usePage().props as any; // අපිට අවශ්‍ය නම් මෙහි Flash Messages වැනි දේවල් කියවා ගත හැක

    // Success Alert එකක් වෙලාවකට පෙන්වලා අයින් කරන්න පාවිච්චි කරන State එකක්
    const [showAlert, setShowAlert] = useState(false);

    // 2. Inertia Form Hook එක TypeScript වලට ගැළපෙන සේ සකස් කිරීම
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: '',
        name: '',
        price: '',
        description: '',
        image: null as File | null, // Image එක File Object එකක් හෝ null විය හැක
    });

    // Flash Message එකක් ආපු ගමන් Alert එක පෙන්වන්න ක්‍රියාත්මක වන කොටස
    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            // තත්පර 4කට පස්සේ ඇලර්ට් එක ඔටෝ අයින් වෙන්න සැලැස්වීම
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post('/products', {
            // දත්ත ටික DB එකට සාර්ථකව වැටුණොත් විතරක් Form එක Reset කිරීම
            onSuccess: () => {
                reset(); // 👈 ෆෝම් එකේ දත්ත ඔක්කොම ක්ලීන් (Clean) කරනවා
            },
        });
    };

    return (
        <div className="mx-auto mt-10 max-w-2xl rounded-lg p-6 shadow-md">
            <Head title="Sell New Product" />

            {/* 🌟 සාර්ථක වුණාම උඩින්ම පාවෙලා එන Success Alert එක */}
            {showAlert && flash?.success && (
                <div className="fixed top-5 right-5 z-50 flex animate-bounce items-center space-x-2 rounded-lg bg-emerald-500 px-6 py-3 text-white shadow-lg">
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

            <h1 className="mb-6 text-2xl font-bold text-gray-800">
                Add Product to SnapMarket
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.category_id}
                        </p>
                    )}
                </div>

                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="e.g., iPhone 15 Pro"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Price (LKR)
                    </label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="0.00"
                    />
                    {errors.price && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.price}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Tell us more about the item..."
                    />
                    {errors.description && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Product Image
                    </label>
                    <input
                        type="file"
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                                setData('image', files[0]); // පළමු ෆයිල් එක සිලෙක්ට් කරගැනීම
                            }
                        }}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {errors.image && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.image}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                >
                    {processing ? 'Uploading...' : 'List Product'}
                </button>
            </form>
        </div>
    );
}
