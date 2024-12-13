import {
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction,
  PermissionResolvable,
  StringSelectMenuInteraction,
} from "discord.js";
import SettingModel from "../database/models/SettingModel";

export async function hasPermissions(
  int:
    | CommandInteraction
    | ModalSubmitInteraction
    | StringSelectMenuInteraction
    | ButtonInteraction,
  memberPermissions: PermissionResolvable[]
): Promise<boolean | undefined> {
  const guild = int.guild;
  const member = int.member;

  try {
    if (!member || !guild) {
      await int.reply({
        content: "Hubo un error con guild y user",
        ephemeral: true,
      });
      return false;
    }

    const setApp = await SettingModel.findOne({
      guild_id: guild.id,
    });

    if (!setApp) {
      return true;
    }

    //@ts-ignore
    const isAdmin = member.roles.cache.some((role) =>
      //@ts-ignore
      setApp.settings.admin_roles.includes(role.id)
    );

    const channelId = int.channel?.id;

    //@ts-ignore
    const isBlocked = setApp.settings?.channel_block.includes(channelId);

    if (!isAdmin && isBlocked) {
      await int.reply({
        content: "El canal está bloqueado para este comando.",
        ephemeral: true,
      });
      return false;
    }

    //@ts-ignore
    const hasRequiredPermissions = member.permissions.has(memberPermissions);
    if (!hasRequiredPermissions) {
      await int.reply({
        content:
          "No tienes los permisos necesarios para ejecutar este comando.",
        ephemeral: true,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error en hasPermissions:", error);
    await int.reply({
      content: "Hubo un error al procesar el comando.",
      ephemeral: true,
    });
    return undefined;
  }
}

const userCommandExe = new Map<string, string>();

export function storeUserCommandExe(intId: string, userId: string) {
  userCommandExe.set(intId, userId);
}

export async function isUserCommandExe(
  int: CommandInteraction | ButtonInteraction | StringSelectMenuInteraction
): Promise<boolean> {
  const intId = int.id;
  const userId = int.user.id;

  const storeUserId = userCommandExe.get(intId);

  if (userId !== storeUserId) {
    await int.reply({
      content: "No puedes interactuar con este botón / selector.",
      ephemeral: true,
    });
    return false;
  }

  return true;
}
