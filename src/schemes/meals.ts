import zod from 'zod'

export const createMealsScheme = zod.object({
  name: zod.string(),
  description: zod.string(),
  is_diet: zod.boolean(),
})