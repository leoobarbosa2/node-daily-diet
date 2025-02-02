import zod from 'zod'

export const createUserScheme = zod.object({
  username: zod.string(),
})