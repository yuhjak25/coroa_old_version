import WarnModel from "../../../../config/database/models/WarnModel";
import { SelectMenuData } from "../../../../config/types/types";
import translations from "../../../../config/lang/translation.json";
import { getPreferredLanguage } from "../../../../config/functions/language";

const selectWarn: SelectMenuData = {
  customId: "selectWarn",
  run: async (client, int) => {
    try {
      const selectedValue = int.values[0];
      const [userId, , warningIndex] = selectedValue.split("_");
      const warningIndexInt = parseInt(warningIndex) - 1;

      const guild = int.guild;

      const warnRecord = await WarnModel.findOne({
        guild_id: guild?.id,
        "settings.user_id": userId,
      });

      const language = await getPreferredLanguage(int);

      if (warnRecord) {
        const warningReason = warnRecord.settings?.reasons[warningIndexInt];

        if (warningReason) {
          //@ts-ignore
          warnRecord.settings?.warns -= 1;
          warnRecord.settings?.reasons.splice(warningIndexInt, 1);

          if (warnRecord.settings?.warns === 0) {
            await WarnModel.findOneAndDelete({
              guild_id: guild?.id,
              "settings.user_id": userId,
            });

            await int.reply({
              content: translations.$commands["$warnings.ts"].responds.noWarn[
                language
              ]
                .replace("${warningIndexInt + 1}", warningIndexInt + 1)
                .replace("${userId}", userId),
              ephemeral: true,
            });
          } else {
            // Save the updated record
            await warnRecord.save();

            await int.reply({
              content: translations.$commands[
                "$warnings.ts"
              ].responds.warnDelete[language]
                .replace("${warningIndexInt + 1}", warningIndexInt + 1)
                .replace("${userId}", userId)
                .replace(
                  "${warnRecord.settings?.warns}",
                  warnRecord.settings?.warns
                ),
              ephemeral: true,
            });
          }
        } else {
          await int.reply({
            content:
              translations.$commands["$warnings.ts"].error.genError[language],
            ephemeral: true,
          });
        }
      } else {
        await int.reply({
          content:
            translations.$commands["$warnings.ts"].error.noWarns[language],
          ephemeral: true,
        });
      }
    } catch (err) {
      const language = await getPreferredLanguage(int);
      await int.reply({
        content:
          translations.$commands["$warnings.ts"].error.updateError[language],
        ephemeral: true,
      });
      console.log(err);
    }
  },
};

export default selectWarn;
