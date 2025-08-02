// export const parseFile = (file: File) => {
//     // return new Promise((resolve, reject) => {
//     if (file.type !== "text/plain") {
//         // reject(new Error("Only .txt files are supported"));
//         throw new Error("Only .txt files are supported");
//         // return;
//     }

//     const reader = new FileReader();

//     reader.onload = () => {
//         if (typeof reader.result === "string") {
//             // resolve(reader.result);
//             return reader.result;
//         } else {
//             throw new Error("Failed to read file as string");
//             // reject(new Error("Failed to read file as string"));
//         }
//     };

//     reader.onerror = () => {
//         // reject(new Error("Error reading file"));
//         throw new Error("Error reading file");
//     };

//     reader.readAsText(file);
// };



export const parseFile = (file: File) => {
    // return new Promise((resolve, reject) => {
    if (file.type !== "text/plain") {
        // reject(new Error("Only .txt files are supported"));
        throw new Error("Only .txt files are supported");
        // return;
    }

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Failed to read file as string"));
            }
        };

        reader.onerror = () => {
            reject(new Error("Error reading file"));
        };

        reader.readAsText(file);
    });
};