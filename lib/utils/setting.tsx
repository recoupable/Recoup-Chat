import JoiBase from "joi";

export const validation = JoiBase.object({
  name: JoiBase.string().messages({
    "string.empty": `Please fill out this field.`,
  }),
  spotifyUrl: JoiBase.string().messages({
    "string.empty": `Please fill out this field.`,
  }),
  instruction: JoiBase.allow(),
  label: JoiBase.allow(),
  appleUrl: JoiBase.allow(),
  tiktok: JoiBase.allow(),
  instagram: JoiBase.allow(),
  youtube: JoiBase.allow(),
  twitter: JoiBase.allow(),
});
