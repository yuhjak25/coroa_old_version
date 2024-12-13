import {
  PermissionResolvable,
  CommandInteraction,
  Client,
  EmbedBuilder,
  ColorResolvable,
} from "discord.js";
import os from "os";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { version as botVersion } from "../../../../package.json";
import appConfig from "../../../config/interfaces/Config";
import { getPreferredColor } from "../../../config/functions/color";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
];

const botInfo: SlashCommandData = {
  name: "bot-info",
  description: "Shows the bot information.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  run: async (client: Client, int: CommandInteraction, args: string[]) => {
    const app = int.client;

    const color = await getPreferredColor(int);
    try {
      const dev = appConfig.coroa.dev;

      const uptime = app.uptime ? Math.floor(app.uptime / 1000) : 0;
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = uptime % 60;

      const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
      const formattedMemoryUsage = Math.round(memoryUsage * 100) / 100;

      const inviteLink =
        "https://discord.com/oauth2/authorize?client_id=1238962260827836526&permissions=8&scope=applications.commands+bot";

      const nodeVersion = process.version;

      const osType = os.type();
      const osPlatform = os.platform();

      const botInfoEmbed = new EmbedBuilder()
        .setAuthor({ name: "App info" })
        .setThumbnail(app.user?.displayAvatarURL() || "")
        .addFields(
          {
            name: "Developer:",
            value: `${dev}`,
            inline: true,
          },
          {
            name: "Guilds:",
            value: `${app.guilds.cache.size}`,
            inline: true,
          },
          {
            name: "Users:",
            value: `${app.users.cache.size}`,
            inline: true,
          },
          {
            name: "Uptime:",
            value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            inline: true,
          },
          {
            name: "Memory Usage:",
            value: `${formattedMemoryUsage} MB`,
            inline: true,
          },
          {
            name: "Bot Version:",
            value: `\`${botVersion}\``,
            inline: true,
          },
          {
            name: "Node.js Version:",
            value: `\`${nodeVersion}\``,
            inline: true,
          },
          {
            name: "OS:",
            value: `${osType} (${osPlatform})`,
            inline: true,
          },
          {
            name: "Bot Invite Link:",
            value: `[Invite me](${inviteLink})`,
            inline: true,
          }
        )
        .setColor(color as ColorResolvable);

      await int.reply({
        embeds: [botInfoEmbed],
      });
    } catch (e) {
      console.log(e);
      await int.reply({
        content: "There was an error while fetching the bot information.",
        ephemeral: true,
      });
    }
  },
};

export default botInfo;
