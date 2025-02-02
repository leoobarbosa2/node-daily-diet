import zod from 'zod'

export const createMealsScheme = zod.object({
  name: zod.string(),
  description: zod.string(),
  created_at: zod.string().optional(),
  is_diet: zod.boolean(),
})