const { Router } = require("express");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminSuper_adminCheskerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");
const {
  getAllAudios,
  searchAudio,
  getOneAudio,
  addAudio,
  updateAudio,
  deleteAudio,
  clearAudioParts,
  deleteAudioBook,
} = require("../controller/audio.controller");

const AudioRouter = Router();

AudioRouter.get("/get_all_audios", getAllAudios);
AudioRouter.get("/search_audio", searchAudio);
AudioRouter.get("/get_one_audio/:id", getOneAudio);
AudioRouter.post(
  "/add_audio/:bookId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  addAudio
);
AudioRouter.put(
  "/audio/:bookId/:partId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  updateAudio
);
AudioRouter.delete(
  "/audio/:bookId/:partId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  deleteAudio
);
AudioRouter.delete(
  "/clear_audio_parts/:bookId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  clearAudioParts
);
AudioRouter.delete(
  "/delete_audio_book/:bookId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  deleteAudioBook
);

module.exports = AudioRouter;
