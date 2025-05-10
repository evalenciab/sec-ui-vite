import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
  // For simplicity, making these strings. In a real app, they might be dates or have specific formats.
  lastAccess: z.string().min(1, 'Last access date is required'), 
  addedBy: z.string().min(1, 'Added by user is required'),
  addedAt: z.string().min(1, 'Added at date is required'),
});

export type UserFormData = z.infer<typeof userSchema>; 