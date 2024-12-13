import mongoose from "mongoose";

const suggestionCreate = new mongoose.Schema({
  guild_id: String,
  settings: {
    channel_id: String,
  },
});

export default mongoose.model("suggestionSystem", suggestionCreate);
