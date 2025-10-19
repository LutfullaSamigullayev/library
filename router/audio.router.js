const { Router } = require("express");
const multer = require("multer");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminSuper_adminCheskerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");
const audioValidatorMiddleware = require("../middleware/audio.validator.middleware");
const {
  getAllAudios,
  searchAudio,
  getOneAudio,
  addAudio,
  updateAudioPart,
  deleteOneAudio,
  deleteAudioBook,
} = require("../controller/audio.controller");

const AudioRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

AudioRouter.get("/get_all_audios", getAllAudios);
AudioRouter.get("/search_audio", searchAudio);
AudioRouter.get("/get_one_audio/:id", getOneAudio);

AudioRouter.post(
  "/add_audio/:bookId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  audioValidatorMiddleware,
  upload.single("audio"),
  addAudio
);

AudioRouter.put(
  "/update_audio/:bookId/:partId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  upload.single("audio"),
  updateAudioPart
);

AudioRouter.delete(
  "/delete_one_audio/:bookId/:partId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  deleteOneAudio
);

AudioRouter.delete(
  "/delete_audio_book/:bookId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  deleteAudioBook
);

module.exports = AudioRouter;
