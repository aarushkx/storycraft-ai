"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background w-full px-6 py-4 flex items-center justify-between max-w-4xl mx-auto border-b">
            <Link href="/" className="text-2xl font-bold">
                {APP_NAME}
            </Link>
            {pathname !== "/" && pathname !== "/story" && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>
            )}
        </header>
    );
};

export default Header;
