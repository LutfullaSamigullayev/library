const supabase = require("../../config/supabase");
const CustomErrorHandler = require("../../error/custom-error-handler");

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
/* ☁️ Universal fayl yuklash funksiyasi */
async function uploadFile(bucket, buffer, filePath, contentType, allowedTypes = []) {
  if (allowedTypes.length && !allowedTypes.includes(contentType)) {
    throw CustomErrorHandler.BadRequest(
      `Ushbu format (${contentType}) qo‘llab-quvvatlanmaydi!`
    );
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, { upsert: true, contentType });

  if (error) throw CustomErrorHandler.BadRequest("Faylni yuklashda xatolik yuz berdi!");
  return data;
}

/* -------------------------------------------------- */
/* 🚚 Faylni ko‘chirish (copy & remove) */
async function moveFile(bucket, oldPath, newPath) {
  const { error: copyError } = await supabase.storage.from(bucket).copy(oldPath, newPath);
  if (copyError) throw CustomErrorHandler.BadRequest("Faylni ko‘chirishda xatolik yuz berdi!");
  await removeFile(bucket, oldPath);
  return true;
}

/* -------------------------------------------------- */
/* 🗑️ Faylni o‘chirish */
async function removeFile(bucket, objectPath) {
  const { error } = await supabase.storage.from(bucket).remove([objectPath]);
  if (error) throw CustomErrorHandler.BadRequest("Faylni o‘chirishda xatolik yuz berdi!");
  return true;
}

/* -------------------------------------------------- */
/* 🧹 Bo‘sh papkalarni tozalash */
async function removeEmptyFolders(bucket, folderPaths = []) {
  try {
    for (const folderPath of folderPaths) {
      const { data: files, error } = await supabase.storage
        .from(bucket)
        .list(folderPath, { limit: 1 });

      if (error) {
        console.error(`❌ ${folderPath} papka tekshiruvida xatolik:`, error.message);
        continue;
      }

      if (!files || files.length === 0) {
        await supabase.storage.from(bucket).remove([folderPath]);
        console.log(`🗑️ Bo‘sh papka o‘chirildi: ${folderPath}`);
      }
    }
  } catch (err) {
    console.error("❌ Papkalarni tozalashda xatolik:", err.message);
  }
}

module.exports = {
  sanitizeName,
  uploadFile,
  moveFile,
  removeFile,
  removeEmptyFolders,
};
