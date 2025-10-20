const mm = require("music-metadata");
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

const BUCKET = "audios";

const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/mp4",
  "audio/x-m4a",
  "audio/flac",
];

/* -------------------------------------------------- */
/* 🎧 Audio yuklash */
async function uploadAudio(buffer, authorName, bookTitle, partTitle, originalName) {
  const format = path.extname(originalName).slice(1).toLowerCase() || "mp3";
  const contentType = `audio/${format === "mp3" ? "mpeg" : format}`;

  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(bookTitle);
  const safePart = sanitizeName(partTitle);
  const filePath = `${safeAuthor}/${safeBook}/${safePart}.${format}`;

  await uploadFile(BUCKET, buffer, filePath, contentType, ALLOWED_AUDIO_TYPES);

  const metadata = await mm.parseBuffer(buffer, `audio/${format}`, { duration: true });
  const duration = Math.round(metadata.format.duration || 0);
  const sizeInMB = +(buffer.length / (1024 * 1024)).toFixed(2);

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl, format, size: sizeInMB, duration, objectPath: filePath };
}

/* -------------------------------------------------- */
async function moveAudio(oldPath, authorName, bookTitle, newPartTitle) {
  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(bookTitle);
  const safePart = sanitizeName(newPartTitle);
  const format = path.extname(oldPath).slice(1) || "mp3";

  const newPath = `${safeAuthor}/${safeBook}/${safePart}.${format}`;
  await moveFile(BUCKET, oldPath, newPath);

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(newPath);
  return { success: true, newUrl: publicUrlData.publicUrl, newPath };
}

/* -------------------------------------------------- */
async function removeAudio(objectPath) {
  return await removeFile(BUCKET, objectPath);
}

/* -------------------------------------------------- */
async function updateAudio(oldPath, buffer, authorName, bookTitle, newPartTitle, originalName, title) {
  const format = path.extname(originalName).slice(1).toLowerCase() || "mp3";
  const contentType = `audio/${format === "mp3" ? "mpeg" : format}`;
  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(bookTitle);
  const safePart = sanitizeName(newPartTitle);
  const newPath = `${safeAuthor}/${safeBook}/${safePart}.${format}`;

  await uploadFile(BUCKET, buffer, newPath, contentType, ALLOWED_AUDIO_TYPES);
  if (title) await removeFile(BUCKET, oldPath);

  const metadata = await mm.parseBuffer(buffer, `audio/${format}`, { duration: true });
  const duration = Math.round(metadata.format.duration || 0);
  const sizeInMB = +(buffer.length / (1024 * 1024)).toFixed(2);

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(newPath);

  return { url: publicUrlData.publicUrl, format, size: sizeInMB, duration, objectPath: newPath };
}

module.exports = {
  uploadAudio,
  moveAudio,
  removeAudio,
  updateAudio,
  removeEmptyFolders, // universal
};
