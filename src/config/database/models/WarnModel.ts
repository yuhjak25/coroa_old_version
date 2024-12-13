import mongoose from "mongoose";

const WarnModal = new mongoose.Schema({
  guild_id: String,
  settings: {
    user_id: String,
    mod_id: String,
    warns: Number,
    reasons: [String],
  },
});

export default mongoose.model("warns", WarnModal);
