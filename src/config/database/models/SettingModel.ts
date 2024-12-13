import mongoose from "mongoose";

const settingApp = new mongoose.Schema({
  guild_id: String,
  settings: {
    language: String,
    color: String,
    admin_roles: [String],
    channel_block: [String],
  },
});

export default mongoose.model("settingApp", settingApp);
