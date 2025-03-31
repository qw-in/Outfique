"use client"
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, FileText, ListOrdered, LogOut, Package, Printer, SendToBack, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void;
}

const menuItems = [
    {
        name: "Products",
        icon: Package,
        href: "/super-admin/products/list",
    },
    {
        name: "Add New Product",
        icon: Printer,
        href: "/super-admin/products/add",
    },
    {
        name: "Orders",
        icon: SendToBack,
        href: "/super-admin/orders",
    },
    {
        name: "Coupons",
        icon: FileText,
        href: "/super-admin/coupons/list",
    },
    {
        name: "Create Coupon",
        icon: ListOrdered,
        href: "/super-admin/coupons/add",
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/super-admin/settings",
    },
    {
        name: "Logout",
        icon: LogOut,
        href: "",
    },
];

function SuperAdminSidebar({ isOpen, toggle }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuthStore();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    async function handleLogout() {
        await logout();
        router.push("/auth/login");
    }

    const sidebarVariants = {
        open: { width: "280px", transition: { duration: 0.3, ease: "easeOut" } },
        closed: { width: "80px", transition: { duration: 0.3, ease: "easeOut" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div 
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-50 to-white transition-all duration-300 shadow-lg",
                "border-r"
            )}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={sidebarVariants}
        >
            <div className="flex h-20 items-center justify-between px-6 border-b">
                {isOpen ? (
                    <motion.div 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <h1 className="font-bold text-xl text-slate-800">
                            Admin Panel
                        </h1>
                    </motion.div>
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "rounded-full hover:bg-slate-100",
                        !isOpen && "mx-auto"
                    )}
                    onClick={toggle}
                >
                    {isOpen ? (
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    ) : (
                        <ChevronRight className="h-5 w-5 text-slate-600" />
                    )}
                </Button>
            </div>

            <div className="py-6 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const isLogout = item.name === "Logout";
                    
                    return (
                        <motion.div
                            key={item.name}
                            onClick={isLogout ? handleLogout : () => router.push(item.href)}
                            className={cn(
                                "flex cursor-pointer items-center rounded-lg px-3 py-3 text-sm transition-all duration-200",
                                isActive 
                                    ? "bg-primary text-white shadow-md" 
                                    : hoveredItem === item.name
                                        ? "bg-slate-100 text-primary"
                                        : "text-slate-600 hover:bg-slate-100",
                                isOpen ? "justify-start" : "justify-center",
                                isLogout && "mt-8 text-red-500 hover:bg-red-50 hover:text-red-600",
                                isLogout && isActive && "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                            )}
                            onMouseEnter={() => setHoveredItem(item.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            initial={isOpen ? "hidden" : "visible"}
                            animate="visible"
                            variants={itemVariants}
                            transition={{ duration: 0.2 }}
                        >
                            <item.icon className={cn(
                                "h-5 w-5",
                                isActive ? "text-white" : isLogout ? "text-red-500" : "text-slate-600",
                                hoveredItem === item.name && !isActive && "text-primary",
                                hoveredItem === item.name && isLogout && !isActive && "text-red-600"
                            )} />
                            
                            {isOpen && (
                                <motion.span 
                                    className={cn(
                                        "ml-3 font-medium",
                                        isActive ? "text-white" : isLogout ? "text-red-500" : "text-slate-700"
                                    )}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                >
                                    {item.name}
                                </motion.span>
                            )}
                            
                            {isActive && isOpen && (
                                <motion.div 
                                    className="ml-auto w-1.5 h-5 bg-white/50 rounded-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className={cn(
                "absolute bottom-0 left-0 right-0 p-4",
                isOpen ? "block" : "hidden"
            )}>
                <motion.div 
                    className="bg-slate-50 rounded-lg p-4 text-xs text-slate-500 border border-slate-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="font-medium text-slate-700 mb-1">Admin Dashboard </p>
                    <p>© 2025 Outfique</p>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default SuperAdminSidebar