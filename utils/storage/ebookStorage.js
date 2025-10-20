const path = require("path");
const supabase = require("../../config/supabase");
const CustomErrorHandler = require("../../error/custom-error-handler");
const {
  sanitizeName,
  uploadFile,
  moveFile,
  removeFile,
  removeEmptyFolders,
} = require("./storageUtils");

const BUCKET = "ebooks";

const ALLOWED_EBOOK_TYPES = [
  "application/pdf",
  "application/epub+zip",
  "application/x-mobipocket-ebook",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/* -------------------------------------------------- */
/* 📚 E-book yuklash */
async function uploadEbook(buffer, authorName, bookTitle, originalName) {
  const format = path.extname(originalName).slice(1).toLowerCase();
  const contentType = getMimeType(format);

  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(bookTitle);
  const filePath = `${safeAuthor}/${safeBook}/${safeBook}.${format}`;

  await uploadFile(BUCKET, buffer, filePath, contentType, ALLOWED_EBOOK_TYPES);

  const sizeInMB = +(buffer.length / (1024 * 1024)).toFixed(2);
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl, format, size: sizeInMB, objectPath: filePath };
}

/* -------------------------------------------------- */
async function moveEbook(oldPath, authorName, newBookTitle) {
  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(newBookTitle);
  const format = path.extname(oldPath).slice(1);
  const newPath = `${safeAuthor}/${safeBook}/${safeBook}.${format}`;

  await moveFile(BUCKET, oldPath, newPath);
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(newPath);
  return { success: true, newUrl: publicUrlData.publicUrl, newPath };
}

/* -------------------------------------------------- */
async function removeEbook(objectPath) {
  return await removeFile(BUCKET, objectPath);
}

/* -------------------------------------------------- */
async function updateEbook(oldPath, buffer, authorName, newBookTitle, originalName, title) {
  const format = path.extname(originalName).slice(1).toLowerCase();
  const contentType = getMimeType(format);
  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(newBookTitle);
  const newPath = `${safeAuthor}/${safeBook}/${safeBook}.${format}`;

  await uploadFile(BUCKET, buffer, newPath, contentType, ALLOWED_EBOOK_TYPES);
  if (title) await removeFile(BUCKET, oldPath);

  const sizeInMB = +(buffer.length / (1024 * 1024)).toFixed(2);
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(newPath);

  return { url: publicUrlData.publicUrl, format, size: sizeInMB, objectPath: newPath };
}

/* -------------------------------------------------- */
/* MIME aniqlovchi yordamchi */
function getMimeType(format) {
  const map = {
    pdf: "application/pdf",
    epub: "application/epub+zip",
    mobi: "application/x-mobipocket-ebook",
    txt: "text/plain",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[format] || "application/octet-stream";
}

module.exports = {
  uploadEbook,
  moveEbook,
  removeEbook,
  updateEbook,
  removeEmptyFolders, // universal
};
