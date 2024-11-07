import JoiBase from "joi"

export const validation = JoiBase.object({
  name: JoiBase.allow(),
  spotifyUrl: JoiBase.allow(),
})
