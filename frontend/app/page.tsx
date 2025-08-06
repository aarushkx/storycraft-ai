"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const LandingPage = () => {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <WavyBackground
                key={theme}
                className="max-w-4xl mx-auto"
                backgroundFill={theme === "dark" ? "black" : "white"}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-left space-y-8"
                >
                    <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-7xl">
                        Create Short Story Videos with Realistic AI Voices.
                    </h1>
                    <Button asChild size="lg">
                        <Link href="/story">
                            Get Started <ArrowRight className="ml-1" />
                        </Link>
                    </Button>
                </motion.div>
            </WavyBackground>
        </div>
    );
};

export default LandingPage;
