"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowRight, Loader2, Pen, Sparkles, Upload, X } from "lucide-react";
import { parseFile } from "@/lib/parser";
import { BASE_API_URL, EXAMPLE_THEMES } from "@/lib/constants";
import { toast } from "sonner";
import Link from "next/link";

const StoryPage = () => {
    const [text, setText] = useState("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [theme, setTheme] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const charCount = text.length;

    const exampleThemes = useMemo(() => {
        const shuffled = [...EXAMPLE_THEMES].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }, []);

    useEffect(() => {
        if (text.trim()) localStorage.setItem("STORY", text);
        else localStorage.removeItem("STORY");
    }, [text]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if (file.type === "text/plain") {
                try {
                    const content = await parseFile(file);
                    setText(content as string);
                    setUploadedFile(file);
                } catch (error) {
                    toast.error(
                        "Failed to read the text file. Please try again."
                    );
                }
            } else return;
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "text/plain": [".txt"] },
        multiple: false,
        noClick: false,
    });

    const handleFileRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setText("");
        setUploadedFile(null);
    };

    const handleGenerateStory = async () => {
        if (!theme.trim()) return;

        setIsGenerating(true);
        try {
            const response = await fetch(
                `${BASE_API_URL}/ollama/generate-story`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ theme }),
                }
            );

            if (!response.ok) throw new Error("Failed to generate story");

            const data = await response.json();
            setText(data.story);
            setIsDialogOpen(false);
            setTheme("");
        } catch (error) {
            toast.error("Failed to generate story. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOnKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isGenerating && theme.trim()) {
            e.preventDefault();
            handleGenerateStory();
        }
    };

    return (
        <>
            {/* Heading */}
            <h1 className="text-2xl font-bold mt-24 px-6">Share Your Story</h1>

            <div className="px-6 py-2 space-y-6 md:space-y-8 min-h-[calc(100vh-8rem)] md:min-h-0 pb-20 md:pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-start mt-2">
                    {/* Textarea Section */}
                    <div className="flex flex-col h-full space-y-2">
                        <Textarea
                            placeholder="Write your story here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="h-[250px] md:h-[300px] resize-none"
                        />
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{charCount} characters</span>
                            <span>{wordCount} words</span>
                        </div>
                    </div>

                    {/* Dropzone Section */}
                    <div className="flex flex-col h-full space-y-2">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center min-h-[250px] md:min-h-[300px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
                                isDragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                            }`}
                        >
                            <input {...getInputProps()} />
                            {uploadedFile ? (
                                <div className="space-y-1 w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-sm font-medium">
                                            {uploadedFile.name}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleFileRemove}
                                            className="h-6 w-6 p-0 cursor-pointer"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-left">
                                        {(
                                            uploadedFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mb-2 md:mb-4" />
                                    {isDragActive ? (
                                        <p className="text-muted-foreground text-sm">
                                            Drop the file here...
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-muted-foreground mb-0.5 text-sm">
                                                Drag and drop a .txt file here
                                            </p>
                                            <p className="text-xs md:text-sm text-muted-foreground">
                                                or click to select files
                                            </p>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-6 md:pt-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-1" />
                                        Generate with AI
                                    </>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md max-w-[90vw]">
                            <DialogHeader>
                                <DialogTitle className="py-0.5">
                                    <VisuallyHidden>
                                        AI Generation Dialog
                                    </VisuallyHidden>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Describe your story theme..."
                                        value={theme}
                                        onChange={(e) =>
                                            setTheme(e.target.value)
                                        }
                                        disabled={isGenerating}
                                        onKeyDown={handleOnKeyDown}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                                        {exampleThemes.map(
                                            (exampleTheme, index) => (
                                                <Button
                                                    key={index}
                                                    variant="ghost"
                                                    className="justify-start h-auto p-3 text-left text-sm cursor-pointer whitespace-normal break-words"
                                                    onClick={() =>
                                                        setTheme(exampleTheme)
                                                    }
                                                    disabled={isGenerating}
                                                >
                                                    <span className="line-clamp-2">
                                                        {exampleTheme}
                                                    </span>
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        size="sm"
                                        onClick={handleGenerateStory}
                                        className="cursor-pointer"
                                        disabled={!theme.trim()}
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        ) : (
                                            <Pen className="w-4 h-4 mr-1" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {!text.trim() ? (
                        <Button size="sm" disabled>
                            Next <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : (
                        <Button asChild size="sm">
                            <Link href="/audio">
                                Next <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default StoryPage;
