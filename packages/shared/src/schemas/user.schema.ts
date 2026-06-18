import z from 'zod';

export const UserSchema = z.object({
  id: z.string(),

  githubId: z.string(),

  email: z.email(),

  username: z.string(),

  name: z.string(),

  avatarUrl: z.string(),

  provider: z.literal('github'),
});

export type UserDto = z.infer<typeof UserSchema>;
