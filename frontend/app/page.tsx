"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-left space-y-8">
                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-7xl">
                    Create Short Story Videos with Realistic AI Voices.
                </h1>
                <Button asChild size="lg">
                    <Link href="/home">
                        Get Started <ArrowRight className="ml-1" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default LandingPage;
