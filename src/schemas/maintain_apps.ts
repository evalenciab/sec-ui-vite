import { z } from 'zod';

export const maintainAppsSchema = z
  .object({
    appName: z.string().min(1, 'App Name is required'),
    appDescription: z.string().optional(),
    deleteInactiveUsers: z.boolean().default(false),
    retentionDays: z.number().int().positive().optional(),
    businessOwner: z.object({
      id: z.string().optional(),
      label: z.string().optional(),
    }),
    applicationAdmins: z.array(z.object({
      id: z.string().optional(),
      label: z.string().optional(),
    })).optional().default([]),
    roles: z.array(z.object({
      code: z.string().min(1, 'Code is required'),
      name: z.string().min(1, 'Name is required'),
      description: z.string().min(1, 'Description is required'),
      accessType: z.object({
        id: z.string(),
        label: z.string(),
      }),
    })).optional().default([]),
  })
  .refine(
    (data) => {
      if (data.deleteInactiveUsers && data.retentionDays === undefined) {
        return false; // Validation fails if deleteInactiveUsers is true but retentionDays is not provided
      }
      return true;
    },
    {
      message: 'Retention days are required when deleting inactive users.',
      path: ['retentionDays'], // Specify the path of the error
    },
  );

export type MaintainAppsFormData = z.infer<typeof maintainAppsSchema>;
