import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "storage", "profile-picture")); // Folder tujuan untuk menyimpan file
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = uniqueSuffix + ext; // Nama file diubah menjadi timestamp + nomor acak + ekstensi asli
    req.newFileName = filename; // Menyimpan nama file yang akan digunakan di request
    cb(null, filename);
  },
});

// Filter untuk menentukan jenis file yang diterima (opsional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;