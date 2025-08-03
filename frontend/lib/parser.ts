export const parseFile = (file: File) => {
    if (file.type !== "text/plain")
        throw new Error("Only .txt files are supported");

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            if (typeof reader.result === "string") resolve(reader.result);
            else reject(new Error("Failed to read file as string"));
        };
        reader.onerror = () => reject(new Error("Error reading file"));

        reader.readAsText(file);
    });
};
