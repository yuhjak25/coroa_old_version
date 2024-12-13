import mongoose from "mongoose";

const ticketCreate = new mongoose.Schema({
  guild_id: String,
  settings: {
    channel_id: String,
    transcript_channel_id: String,
    userChannel: {
      user_id: String,
      user_channel_id: String,
    },
  },
});

export default mongoose.model("ticketSystem", ticketCreate);
