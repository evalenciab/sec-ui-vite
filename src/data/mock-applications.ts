import { z } from "zod";
import { maintainAppsSchema } from "../schemas/maintain_apps";

// Define the type explicitly for the array
type ApplicationInput = z.input<typeof maintainAppsSchema>;

export const mockApplications: ApplicationInput[] = [
    {
        appId: "APP001",
        appName: "Time Tracker",
        appDescription: "Application for tracking employee work hours.",
        deleteInactiveUsers: true,
        retentionDays: 90,
        roles: [
            {
                code: "ADMIN",
                name: "Administrator",
                description: "Full access to all features.",
                accessType: ["Employee"],
                secureTo: ["Employee"],
            },
            {
                code: "USER",
                name: "Standard User",
                description: "Can track time and view reports.",
                accessType: ["Employee", "Contingent"],
                secureTo: ["Employee"],
            },
        ],
    },
    {
        appId: "APP002",
        appName: "Inventory Manager",
        appDescription: "Manages warehouse inventory levels.",
        deleteInactiveUsers: false,
        // retentionDays: undefined, // Optional, omitted as deleteInactiveUsers is false
        roles: [
            {
                code: "IM_VIEW",
                name: "Viewer",
                description: "Read-only access to inventory.",
                accessType: ["Employee"],
                secureTo: ["Employee"],
            },
            {
                code: "IM_EDIT",
                name: "Editor",
                description: "Can modify inventory records.",
                accessType: ["Employee"],
                secureTo: ["Employee"],
            },
             {
                code: "SUPPLIER_ACCESS",
                name: "Supplier Access",
                description: "Limited access for suppliers.",
                accessType: ["Supplier"],
                secureTo: ["Supplier"],
            },
        ],
    },
    {
        appId: "APP003",
        appName: "Customer Portal",
        appDescription: "Portal for customer interactions.",
        deleteInactiveUsers: true,
        retentionDays: 180,
        roles: [
            {
                code: "CUST_SUPPORT",
                name: "Support Agent",
                description: "Handles customer support tickets.",
                accessType: ["Employee"],
                secureTo: ["Employee"],
            },
            {
                code: "CUST_BASIC",
                name: "Customer",
                description: "Basic portal access for customers.",
                accessType: ["Contingent"], // Assuming external customers are 'Contingent'
                secureTo: ["Employee"], // Secured by internal employees
            },
        ],
    },
]; 