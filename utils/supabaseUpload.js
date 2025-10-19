// utils/supabaseUpload.js
const mm = require("music-metadata");
const path = require("path");
const CustomErrorHandler = require("../error/custom-error-handler");
const supabase = require("../config/supabase");

const BUCKET = "audios"; // Supabase bucket nomi

// 🎧 Ruxsat etilgan audio turlari
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
/* 🔒 Fayl nomini xavfsiz shaklga keltiruvchi funksiya */
function sanitizeName(name) {
  return name
    .toString()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")
    .toLowerCase();
}

/* -------------------------------------------------- */
/* ☁️ Universal fayl yuklash funksiyasi (har xil formatlar uchun) */
async function uploadFile(buffer, filePath, contentType) {
  if (!ALLOWED_AUDIO_TYPES.includes(contentType)) {
    throw CustomErrorHandler.BadRequest(
      `Ushbu audio formati (${contentType}) qo‘llab-quvvatlanmaydi!`
    );
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, { upsert: true, contentType });

  if (error) throw CustomErrorHandler.BadRequest("Audio yuklashda xatolik yuz berdi!");
  return data;
}

/* -------------------------------------------------- */
/* 🚚 Supabase ichida faylni ko‘chirish (copy & remove) */
async function moveFile(oldPath, newPath) {
  const { error: copyError } = await supabase.storage.from(BUCKET).copy(oldPath, newPath);
  if (copyError) throw CustomErrorHandler.BadRequest("Audio faylni ko‘chirishda xatolik yuz berdi!");

  await removeFile(oldPath);
  return true;
}

/* -------------------------------------------------- */
/* 🗑️ Supabase'dan faylni o‘chirish */
async function removeFile(objectPath) {
  const { error } = await supabase.storage.from(BUCKET).remove([objectPath]);
  if (error) throw CustomErrorHandler.BadRequest("Audio faylni o‘chirishda xatolik yuz berdi!");
  return true;
}

/* -------------------------------------------------- */
/* 🎧 Audio faylni Supabase'ga yuklash */
async function uploadAudio(buffer, authorName, bookTitle, partTitle, originalName) {
  const format = path.extname(originalName).slice(1).toLowerCase() || "mp3";
  const contentType = `audio/${format === "mp3" ? "mpeg" : format}`;

  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(bookTitle);
  const safePart = sanitizeName(partTitle);
  const filePath = `${safeAuthor}/${safeBook}/${safePart}.${format}`;

  await uploadFile(buffer, filePath, contentType);

  // 🎚 Audio metadata olish
  const metadata = await mm.parseBuffer(buffer, `audio/${format}`, { duration: true });
  const duration = Math.round(metadata.format.duration || 0);
  const sizeInMB = +(buffer.length / (1024 * 1024)).toFixed(2);

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    format,
    size: sizeInMB,
    duration,
    objectPath: filePath,
  };
}

/* -------------------------------------------------- */
/* 🚚 Audio faylni yangi nom bilan ko‘chirish */
async function moveAudio(oldPath, authorName, bookTitle, newPartTitle) {
  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(bookTitle);
  const safePart = sanitizeName(newPartTitle);
  const format = path.extname(oldPath).slice(1) || "mp3";

  const newPath = `${safeAuthor}/${safeBook}/${safePart}.${format}`;
  await moveFile(oldPath, newPath);

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(newPath);
  return {
    success: true,
    newUrl: publicUrlData.publicUrl,
    newPath,
  };
}

/* -------------------------------------------------- */
/* 🧹 Audio faylni o‘chirish (audioBook parts uchun) */
async function removeAudio(objectPath) {
  return await removeFile(objectPath);
}

/* -------------------------------------------------- */
/* ✏️ Audio faylni yangilash (fayl va nomni bir vaqtda o‘zgartirish) */
async function updateAudio(oldPath, buffer, authorName, bookTitle, newPartTitle, originalName, title) {
  // Eski faylni o‘chirish uchun formatni aniqlaymiz
  const format = path.extname(originalName).slice(1).toLowerCase() || "mp3";
  const contentType = `audio/${format === "mp3" ? "mpeg" : format}`;

  const safeAuthor = sanitizeName(authorName);
  const safeBook = sanitizeName(bookTitle);
  const safePart = sanitizeName(newPartTitle);
  const newPath = `${safeAuthor}/${safeBook}/${safePart}.${format}`;

  // Yangi faylni yuklaymiz
  await uploadFile(buffer, newPath, contentType);
  // Eski faylni o‘chiramiz
  if(title) {
    await removeFile(oldPath);
  }

  // Metadata olish
  const metadata = await mm.parseBuffer(buffer, `audio/${format}`, { duration: true });
  const duration = Math.round(metadata.format.duration || 0);
  const sizeInMB = +(buffer.length / (1024 * 1024)).toFixed(2);

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(newPath);

  return {
    url: publicUrlData.publicUrl,
    format,
    size: sizeInMB,
    duration,
    objectPath: newPath,
  };
}

async function removeEmptyFolders(folderPaths) {
  try {
    for (const folderPath of folderPaths) {
      // Papka ichidagi fayllarni ko‘ramiz
      const { data: files, error } = await supabase.storage
        .from(BUCKET)
        .list(folderPath, { limit: 1 }); // faqat 1 ta element tekshirish kifoya

      if (error) {
        console.error(`❌ ${folderPath} papka tekshiruvida xatolik:`, error.message);
        continue;
      }

      // Agar papka bo‘sh bo‘lsa — o‘chirib tashlaymiz
      if (!files || files.length === 0) {
        await supabase.storage.from(BUCKET).remove([folderPath]);
        console.log(`🗑️ Bo‘sh papka o‘chirildi: ${folderPath}`);
      }
    }
  } catch (err) {
    console.error("❌ Papkalarni tozalashda xatolik:", err.message);
  }
}

/* -------------------------------------------------- */
module.exports = {
  uploadAudio,
  moveAudio,
  removeAudio,
  updateAudio,
  removeEmptyFolders
};
