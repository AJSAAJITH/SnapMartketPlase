<?php

namespace App\Http\Middleware;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $userId = $request->user() ? $request->user()->id : null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            // 💡 1. Real-time Total Unread Count එක මෙතනින් Shared Props වලට එකතු කරනවා
            'total_unread_count' => $userId
                ? Message::where('sender_id', '!=', $userId) // තමන් එවපු ඒවා නෙවෙයි
                    ->where('is_read', false) // තවම කියවලා නැති ඒවා
                    ->whereHas('conversation', function ($query) use ($userId) {
                        // යූසර් බයර් හෝ සෙලර් විදිහට සම්බන්ධ චැට් රූම් වල විතරක් ඒවා
                        $query->where('buyer_id', $userId)->orWhere('seller_id', $userId);
                    })
                    ->count()
                : 0,

            // 💡 මෙන්න මේ කොටස අලුතෙන් එකතු කරන්න
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
