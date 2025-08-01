"use client";

import { Button } from "@/components/ui/button";

const LandingPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="text-left space-y-8 max-w-4xl">
                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-7xl">
                    Create Short Story Videos with Realistic AI Voices.
                </h1>
                <Button size="lg">Get Started</Button>
            </div>
        </div>
    );
};

export default LandingPage;
