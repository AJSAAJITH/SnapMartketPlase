import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutDashboard,
    LayoutGrid,
    MessageSquare,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    // 💡 මෙන්න මෙතනට මැසේජ් ලින්ක් එක එකතු කළා
    {
        title: 'Messages',
        href: '/chat',
        icon: MessageSquare,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

// 💡 Interface එකට totalUnreadCount ඇතුළත් කළා
interface AppSidebarProps {
    totalUnreadCount: number;
}

export function AppSidebar({ totalUnreadCount }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* 💡 NavMain එකට items සමඟ totalUnreadCount එකද ලබා දෙනවා */}
                <NavMain
                    items={mainNavItems}
                    totalUnreadCount={totalUnreadCount}
                />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
