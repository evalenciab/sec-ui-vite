import { z } from "zod";
import { maintainAppsSchema } from "../schemas/maintain_apps";
import { mockApplications } from "../data/mock-applications";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

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
  return [...mockApplications];
}

// Simulate an async API call to create
async function createApplication(newAppData: ApplicationInput): Promise<ApplicationInput> {
   // Simulate network delay
   await new Promise(resolve => setTimeout(resolve, 500));

   // Basic validation: Check if appName already exists (more robust checks might be needed)
   if (mockApplications.some(app => app.appName === newAppData.appName)) {
       throw new Error("Application with this name already exists.");
   }

   // Assign a unique ID if it's not provided (or handle as needed)
   const appToAdd = {
       ...newAppData,
       appId: newAppData.appId || uuidv4(), // Generate UUID if appId is missing
   };


   // In a real app, you'd send a POST request to your API here.
   // For now, we add it to our mock array.
   mockApplications.push(appToAdd);
   console.log("Application added:", appToAdd);
   console.log("Updated mock data:", mockApplications);

   // Return the added application data (API might return the created object)
   return appToAdd;
}

// Simulate an async API call to update (PUT)
async function updateApplication(updatedAppData: ApplicationInput): Promise<ApplicationInput> {
	// Simulate network delay
	await new Promise(resolve => setTimeout(resolve, 500));

	// Find the index of the application to update
	const appIndex = mockApplications.findIndex(app => app.appId === updatedAppData.appId);

	if (appIndex === -1) {
		throw new Error(`Application with ID ${updatedAppData.appId} not found.`);
	}

	// In a real app, you'd send a PUT request to your API here.
	// For now, we update it in our mock array.
	mockApplications[appIndex] = updatedAppData;
	console.log("Application updated:", updatedAppData);
	console.log("Updated mock data:", mockApplications);

	// Return the updated application data (API might return the updated object)
	return updatedAppData;
}

export const applicationService = {
  fetchApplications,
  createApplication,
  updateApplication,
}; 