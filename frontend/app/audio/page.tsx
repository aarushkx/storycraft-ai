"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Pause, Volume2, Loader2 } from "lucide-react";
import { BASE_API_URL } from "@/lib/constants";
import { toast } from "sonner";

type Voice = "f1.wav" | "f2.wav" | "f3.wav" | "m1.wav" | "m2.wav" | "m3.wav";

interface VoiceMapping {
    apiVoice: string;
    label: string;
    gender: "f" | "m";
}

interface SupportedVoices {
    female: string[];
    male: string[];
}

interface AudioCardProps {
    voices: Voice[];
    selectedVoice: string;
    onSelectVoice: (voice: Voice) => void;
    voiceMapping: Record<Voice, VoiceMapping>;
    playingDemo: string | null;
    onPlayDemoVoice: (voice: Voice) => void;
}

const voiceMapping: Record<Voice, VoiceMapping> = {
    "f1.wav": { apiVoice: "af_heart", label: "Sarah", gender: "f" },
    "f2.wav": { apiVoice: "af_aoede", label: "Emma", gender: "f" },
    "f3.wav": { apiVoice: "af_nicole", label: "Nicole", gender: "f" },
    "m1.wav": { apiVoice: "am_adam", label: "Adam", gender: "m" },
    "m2.wav": { apiVoice: "am_echo", label: "David", gender: "m" },
    "m3.wav": { apiVoice: "am_onyx", label: "Michael", gender: "m" },
};

const AudioCard = ({
    voices,
    selectedVoice,
    onSelectVoice,
    voiceMapping,
    playingDemo,
    onPlayDemoVoice,
}: AudioCardProps) => {
    return (
        <div className="space-y-2">
            {voices.map((v) => (
                <Card
                    key={v}
                    className={`px-4 py-2 cursor-pointer shadow-none hover:bg-muted/80 ${
                        selectedVoice === voiceMapping[v].apiVoice
                            ? "bg-muted/80"
                            : ""
                    }`}
                    onClick={() => onSelectVoice(v)}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            {voiceMapping[v].label}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPlayDemoVoice(v);
                            }}
                            className="h-6 w-6 bg-transparent hover:bg-transparent"
                        >
                            {playingDemo === v ? (
                                <Pause className="h-3 w-3 text-muted-foreground" />
                            ) : (
                                <Play className="h-3 w-3 text-muted-foreground" />
                            )}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

const AudioPage = () => {
    const [story, setStory] = useState("");
    const [supportedVoices, setSupportedVoices] = useState<SupportedVoices>({
        female: [],
        male: [],
    });
    const [selectedVoice, setSelectedVoice] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedAudioUrl, setGeneratedAudioUrl] = useState("");
    const [playingDemo, setPlayingDemo] = useState<string | null>(null);

    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

    useEffect(() => {
        setStory(localStorage.getItem("STORY") || "");
        fetchSupportedVoices();
    }, []);

    const fetchSupportedVoices = async () => {
        try {
            const response = await fetch(
                `${BASE_API_URL}/audio/supported-voices`
            );
            if (response.ok) {
                const data = await response.json();
                setSupportedVoices(data.voices);
            }
        } catch {
            toast.error("Failed to fetch supported voices");
        }
    };

    const femaleVoices: Voice[] = ["f1.wav", "f2.wav", "f3.wav"];
    const maleVoices: Voice[] = ["m1.wav", "m2.wav", "m3.wav"];

    const handleVoiceSelect = (voice: Voice) => {
        setSelectedVoice(voiceMapping[voice].apiVoice);
    };

    const onPlayDemoVoice = (voice: Voice) => {
        if (playingDemo && audioRefs.current[playingDemo]) {
            audioRefs.current[playingDemo].pause();
            audioRefs.current[playingDemo].currentTime = 0;
        }

        if (playingDemo === voice) {
            setPlayingDemo(null);
            return;
        }

        const audio = new Audio(`/voices/${voice}`);
        audioRefs.current[voice] = audio;

        audio.play();
        setPlayingDemo(voice);

        audio.onended = () => {
            setPlayingDemo(null);
        };
    };

    const generateAudio = async () => {
        if (!selectedVoice || !story.trim()) return;

        setIsGenerating(true);
        try {
            const response = await fetch(`${BASE_API_URL}/audio/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ story, voice: selectedVoice }),
            });
            if (!response.ok) throw new Error("Failed to generate audio");

            const audioResponse = await fetch(`${BASE_API_URL}/audio/`);
            if (audioResponse.ok) {
                const audioData = await audioResponse.json();
                setGeneratedAudioUrl(audioData.url);
            }
        } catch {
            toast.error("Failed to generate audio. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = () => {
        console.log("Generated audio URL:", generatedAudioUrl);
    };

    return (
        <>
            <h1 className="text-2xl font-semibold mt-24 px-6">
                Choose Your Voice
            </h1>

            <div className="px-6 py-2 space-y-4 md:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mt-2">
                    <div className="space-y-2">
                        <h3 className="text-muted-foreground font-medium">
                            Female
                        </h3>
                        <AudioCard
                            voices={femaleVoices}
                            selectedVoice={selectedVoice}
                            onSelectVoice={handleVoiceSelect}
                            voiceMapping={voiceMapping}
                            playingDemo={playingDemo}
                            onPlayDemoVoice={onPlayDemoVoice}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-muted-foreground font-medium">
                            Male
                        </h3>
                        <AudioCard
                            voices={maleVoices}
                            selectedVoice={selectedVoice}
                            onSelectVoice={handleVoiceSelect}
                            voiceMapping={voiceMapping}
                            playingDemo={playingDemo}
                            onPlayDemoVoice={onPlayDemoVoice}
                        />
                    </div>
                </div>

                {generatedAudioUrl && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium">
                                Generated Audio
                            </span>
                        </div>
                        <div className="max-w-sm">
                            <audio controls className="w-full">
                                <source
                                    src={generatedAudioUrl}
                                    type="audio/wav"
                                />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generateAudio}
                        disabled={
                            !selectedVoice || !story.trim() || isGenerating
                        }
                    >
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Volume2 className="w-4 h-4 mr-1" />
                        )}
                        {isGenerating ? "Generating..." : "Generate Audio"}
                    </Button>

                    <Button asChild size="sm" disabled={!generatedAudioUrl}>
                        <Link href="/background">
                            Next <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AudioPage;
