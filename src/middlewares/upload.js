import multer from "multer";
import path from "path";
import fs from "fs";


const tempFolder = path.join(process.cwd(), "src", "temp");


if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempFolder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("audio/") ||file.mimetype.startsWith("image/") ) {
        cb(null, true);
    } else {
        cb(new Error("Uploaded file must be a image or audio file"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 },
});



export default upload;






