import { ApplicationCommandOptionType } from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";

const sayImage: SlashCommandData = {
  name: "say-image",
  description: "Sends a message with a image.",
  category: Category.gen,
  options: [
    {
      name: "image",
      description: "The image you want to send.",
      type: ApplicationCommandOptionType.Attachment,
      required: true,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const image = int.options.getAttachment("image");

    try {
      int.deferReply;
      int.reply({
        files: [image],
      });
    } catch (err) {
      console.log(err);
    }
  },
};

export default sayImage;
