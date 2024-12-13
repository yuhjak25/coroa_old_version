import {
  ApplicationCommandOptionType,
  PermissionResolvable,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { hasPermissions } from "../../../config/functions/functions";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
  "ModerateMembers",
  "MuteMembers",
];

const muteCmd: SlashCommandData = {
  name: "mute",
  description: "Mute a user.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "user",
      description: "The user to mute.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "duration",
      description: "The time to be mute.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      choices: [
        { name: "60 seconds", value: 60 * 1000 },
        { name: "5 minutes", value: 5 * 60 * 1000 },
        { name: "10 minutes", value: 10 * 60 * 1000 },
        { name: "1 hour", value: 60 * 60 * 1000 },
        { name: "1 day", value: 24 * 60 * 60 * 1000 },
        { name: "1 week", value: 7 * 24 * 60 * 60 * 1000 },
      ],
    },
    {
      name: "reason",
      description: "The reason to mute the user.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const userMute = int.options.getUser("user");
    //@ts-ignore
    const reason = int.options.getString("reason") || "NaN";
    //@ts-ignore
    const duration = int.options.getInteger("duration");
    const guild = int.guild;
    const member = guild?.members.cache.get(userMute?.id || "");
    const user = int.user;

    const userHasPermissions = await hasPermissions(int, requiredPermissions);

    if (!member || !guild) {
      int.reply({
        content: "Error with the member / guild",
        ephemeral: true,
      });
      return;
    }

    if (!userHasPermissions) {
      int.reply({
        content:
          "You do not have the required permissions to use this command.",
        ephemeral: true,
      });
      return;
    }

    if (user === userMute) {
      int.reply({
        content: "You can't mute yourself.",
        ephemeral: true,
      });
      return;
    }

    let isMuted = false;

    // Check if the user is already muted
    guild.channels.cache.forEach((channel) => {
      if (channel.isTextBased()) {
        const textChannel = channel as TextChannel;
        const permissions = textChannel.permissionOverwrites.cache.get(
          userMute!.id
        );
        if (permissions?.deny.has("SendMessages")) {
          isMuted = true;
        }
      }
      if (channel.isVoiceBased()) {
        const voiceChannel = channel as VoiceChannel;
        const permissions = voiceChannel.permissionOverwrites.cache.get(
          userMute!.id
        );
        if (permissions?.deny.has("Speak")) {
          isMuted = true;
        }
      }
    });

    if (isMuted) {
      int.reply({
        content: `${userMute?.tag} is already muted.`,
        ephemeral: true,
      });
      return;
    }

    try {
      guild.channels.cache.forEach(async (channel) => {
        if (channel.isTextBased()) {
          const textChannel = channel as TextChannel;
          await textChannel.permissionOverwrites.edit(userMute!.id, {
            SendMessages: false,
            AddReactions: false,
          });
        }
        if (channel.isVoiceBased()) {
          const voiceChannel = channel as VoiceChannel;
          await voiceChannel.permissionOverwrites.edit(userMute!.id, {
            Speak: false,
          });
        }
      });

      await int.reply({
        content: `${userMute?.tag} has been muted for ${
          duration / 1000
        } seconds. Reason: \n\`${reason}\``,
        ephemeral: false,
      });

      /* Unmute the user */
      setTimeout(async () => {
        guild.channels.cache.forEach(async (channel) => {
          if (channel.isTextBased()) {
            const textChannel = channel as TextChannel;
            await textChannel.permissionOverwrites.edit(userMute!.id, {
              SendMessages: null,
              AddReactions: null,
            });
          }
          if (channel.isVoiceBased()) {
            const voiceChannel = channel as VoiceChannel;
            await voiceChannel.permissionOverwrites.edit(userMute!.id, {
              Speak: null,
            });
          }
        });

        try {
          await int.channel?.send(`${userMute} has been unmuted.`);
        } catch (e) {
          console.log(`Could not send unmute message to ${userMute.tag}`);
        }
      }, duration);
    } catch (e) {
      console.log(e);
      int.reply({
        content: "An error occurred while trying to mute the user.",
        ephemeral: true,
      });
    }
  },
};
export default muteCmd;
