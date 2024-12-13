import { ApplicationCommandOptionType, PermissionResolvable } from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
  "ManageRoles",
  "ModerateMembers",
];

const giveRole: SlashCommandData = {
  name: "give-role",
  description: "Give a role to all users.",
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
    const givenRole = int.options.getRole("role");
    const guild = int.guild;

    if (!guild) {
      int.reply({
        content: "This command can only be used in a guild.",
        ephemeral: true,
      });
      return;
    }

    if (givenRole.id === guild.id) {
      int.reply({
        content: "You cannot assign the @everyone role.",
        ephemeral: true,
      });
      return;
    }

    const role = guild.roles.cache.get(givenRole.id);

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
        return member.roles.add(role);
      });

      await Promise.all(promises);
      int.reply({
        content: `The role ${role.name} has been given to all users.`,
        ephemeral: true,
      });
      return;
    } catch (error) {
      console.error("Failed to add role to some members:", error);
      int.reply({
        content: "An error occurred while adding the role to all users.",
        ephemeral: true,
      });
      return;
    }
  },
};

export default giveRole;
