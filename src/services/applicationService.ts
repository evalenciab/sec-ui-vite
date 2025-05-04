import { z } from "zod";
import { maintainAppsSchema } from "../schemas/maintain_apps";
import { mockApplications } from "../data/mock-applications";

// Define the type explicitly for the return type
type ApplicationInput = z.input<typeof maintainAppsSchema>;

// Simulate an async API call
async function fetchApplications(): Promise<ApplicationInput[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, you would fetch data from an API endpoint here.
  // For now, we return the mock data.
  // We should also validate the fetched data against the schema here
  // but for mock data, we assume it's already valid.
  return mockApplications;
}

export const applicationService = {
  fetchApplications,
}; 