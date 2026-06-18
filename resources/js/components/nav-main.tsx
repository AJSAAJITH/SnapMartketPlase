import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

interface NavMainProps {
    items: NavItem[];
    totalUnreadCount: number; // 💡 උඩින් එවපු count එක බාරගන්නවා
}

export function NavMain({ items, totalUnreadCount }: NavMainProps) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // 💡 මේ රෙන්ඩර් වෙන්නේ 'Messages' ලින්ක් එකද කියලා චෙක් කරනවා
                    const isMessages = item.title === 'Messages';

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex w-full items-center justify-between"
                                >
                                    {/* වම් පැත්ත: Icon එක සහ Text එක */}
                                    <div className="flex items-center gap-2">
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </div>

                                    {/* 🔴 දකුණු පැත්ත: මැසේජ් ලින්ක් එක ඉස්සරහින් පෙන්වන රියල්-ටයිම් කවුන්ටරය */}
                                    {isMessages && totalUnreadCount > 0 && (
                                        <span className="ml-auto inline-flex h-4 min-w-[16px] animate-pulse items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] leading-none font-bold text-white shadow-sm transition-all duration-300">
                                            {totalUnreadCount}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
