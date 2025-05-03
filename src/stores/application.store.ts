import { create } from "zustand";
import { maintainAppsSchema } from "../schemas/maintain_apps";
import { z } from "zod";

interface ApplicationState {
	selectedApplicationRowData: z.input<typeof maintainAppsSchema> | null;
	setSelectedApplicationRowData: (data: z.input<typeof maintainAppsSchema> | null) => void;
	allApplications: z.input<typeof maintainAppsSchema>[];
	setAllApplications: (data: z.input<typeof maintainAppsSchema>[]) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
	selectedApplicationRowData: null,
	setSelectedApplicationRowData: (data) => set({ selectedApplicationRowData: data }),
	allApplications: [],
	setAllApplications: (data) => set({ allApplications: data }),
}));