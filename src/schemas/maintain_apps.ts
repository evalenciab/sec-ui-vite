import { z } from 'zod';

export const roleSchema = z.object({
	code: z.string().min(1, 'Role Code is required'),
	name: z.string().min(1, 'Role Name is required'),
	description: z.string().optional(),
	accessType: z.array(z.enum(['Supplier', 'Employee', 'Contingent'])).min(1, 'Access Type is required'),
	secureTo: z.array(z.enum(['Employee', 'Supplier'])).min(1, 'Secure To is required'),
	
});

export const maintainAppsSchema = z
  .object({
	appId: z.string().optional(),
    appName: z.string().min(1, 'App Name is required'),
    appDescription: z.string().optional(),
    deleteInactiveUsers: z.boolean().default(false),
    retentionDays: z.number().int().positive().optional(),
	roles: z.array(roleSchema).min(1, 'Roles are required'),
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
export type RoleFormData = z.infer<typeof roleSchema>;
