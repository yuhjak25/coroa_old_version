import { ApplicationCommandOptionType, PermissionResolvable } from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
  "ManageRoles",
  "ModerateMembers",
];

const removeRole: SlashCommandData = {
  name: "remove-role",
  description: "Remove a role from all user.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "role",
      description: "The role to give.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const removeRole = int.options.getRole("role");
    const guild = int.guild;

    if (!guild) {
      int.reply({
        content: "This command can only be used in a guild.",
        ephemeral: true,
      });
      return;
    }

    if (removeRole.id === guild.id) {
      int.reply({
        content: "You cannot remove the @everyone role.",
        ephemeral: true,
      });
      return;
    }

    const role = guild.roles.cache.get(removeRole.id);

    if (!role) {
      int.reply({
        content: "The specified role does not exist.",
        ephemeral: true,
      });
      return;
    }

    try {
      const members = await guild.members.fetch();
      const promises = members.map((member) => {
        return member.roles.remove(role);
      });

      await Promise.all(promises);
      int.reply({
        content: `The role ${role.name} has been removed to all users.`,
        ephemeral: true,
      });
      return;
    } catch (e) {
      console.log(e);
      int.reply({
        content: "Error to remove the role.",
        ephemeral: true,
      });
    }
  },
};
export default removeRole;
