import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "bucket/assets/");
    },
    filename: function (req, file, cb) {
        cb(null, `image${path.extname(file.originalname)}`);
    },
});

export const upload = multer({ storage });
