import { create } from "zustand";
import { roleSchema } from "../schemas/maintain_apps";
import { z } from "zod";


interface RoleState {
	selectedRoleRowData: z.input<typeof roleSchema> | null;
	setSelectedRoleRowData: (data: z.input<typeof roleSchema> | null) => void;
	allRoles: z.input<typeof roleSchema>[];
	setAllRoles: (data: z.input<typeof roleSchema>[]) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
	selectedRoleRowData: null,
	setSelectedRoleRowData: (data) => set({ selectedRoleRowData: data }),
	allRoles: [],
	setAllRoles: (data) => set({ allRoles: data }),
}));

