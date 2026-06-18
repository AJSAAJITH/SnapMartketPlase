import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useEffect, useState } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { auth, total_unread_count } = usePage<any>().props;
    const currentUserId = auth?.user?.id;

    // 💡 මුළු වෙබ් අඩවියේම පෙන්විය යුතු Unread Messages එකතුව තියාගන්නා රාමුව (State)
    const [liveTotalUnread, setLiveTotalUnread] = useState<number>(
        total_unread_count || 0,
    );

    // Backend එකෙන් Page එක මාරු වෙද්දී එන අලුත් count එක අප්ඩේට් කරගන්න
    useEffect(() => {
        setLiveTotalUnread(total_unread_count || 0);
    }, [total_unread_count]);

    // =========================================================================
    // 💡 Global Echo Listener: යූසර් කොහේ හිටියත් අලුත් මැසේජ් එකක් ආවොත් Count එක වැඩි කරනවා
    // =========================================================================
    try {
        useEcho(
            `user.${currentUserId}`,
            'MessageSent',
            (e: any) => {
                console.log('📨 New Message Received:', e);
                // අලුත් මැසේජ් එකක් ආපු සැනින් මුළු කවුන්ට් එක 1කින් වැඩි කරනවා
                setLiveTotalUnread((prev) => prev + 1);
            },
            [currentUserId],
            'private',
        );
    } catch (error) {
        console.log('❌ Global Echo Error:', error);
    }

    return (
        <AppShell variant="sidebar">
            {/* 💡 ලයිව් කවුන්ට් එක Prop එකක් විදිහට Sidebar එකට දෙනවා */}
            <AppSidebar totalUnreadCount={liveTotalUnread} />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
