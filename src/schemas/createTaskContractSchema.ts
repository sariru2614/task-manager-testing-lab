import { z } from 'zod';

export const CreateTaskResponseSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z.enum(['pending', 'completed']),
});