import React from 'react';
import { Box, Grid, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { UseFormReturn, Control, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";
import { z } from "zod";
import { AppDialog } from "../AppDialog/AppDialog"; // Generic dialog wrapper
import { AppForm } from "../AppForm/AppForm";
import { RolesForm } from "../RolesForm";
import { RolesTable } from "../RolesTable";
import { maintainAppsSchema, roleSchema } from "../../schemas/maintain_apps";

interface ApplicationEditorDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	dialogTitle: string;
	appForm: UseFormReturn<z.input<typeof maintainAppsSchema>>;
	appendRoleToForm: UseFieldArrayAppend<z.input<typeof maintainAppsSchema>, "roles">;
	removeRoleFromForm: UseFieldArrayRemove;
	control: Control<z.input<typeof maintainAppsSchema>>;
	totalRoles: number;
	currentTab: string;
	onTabChange: (event: React.SyntheticEvent, newTab: string) => void;
}

export function ApplicationEditorDialog({
	open,
	onClose,
	onSave,
	dialogTitle,
	appForm,
	appendRoleToForm,
	removeRoleFromForm,
	control, // Pass control for RolesTable
	totalRoles,
	currentTab,
	onTabChange,
}: ApplicationEditorDialogProps) {
	return (
		<AppDialog
			title={dialogTitle}
			open={open}
			onClose={onClose}
			onSave={onSave}
		>
			<Box component="form" noValidate sx={{ pt: 1 }}> {/* Added padding top to content */}
				<TabContext value={currentTab}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<TabList
							onChange={onTabChange}
							aria-label="application editor tabs"
						>
							<Tab label="Application Settings" value={"1"} />
							<Tab label={`Roles (${totalRoles})`} value={"2"} />
						</TabList>
					</Box>
					<TabPanel value={"1"} sx={{ p: 2, pt: 3 }}> {/* Added padding */}
						<AppForm form={appForm} />
					</TabPanel>
					<TabPanel value={"2"} sx={{ p: 2, pt: 3 }}> {/* Added padding */}
						<Grid container spacing={2}>
							<Grid size={4}>
								<RolesForm appendRole={appendRoleToForm} />
							</Grid>
							<Grid size={8}>
								{/* RolesTable expects 'removeRole', not 'removeRoleFromForm' directly if we match its previous prop name. */}
								{/* However, the hook now provides removeRoleFromForm with the correct signature. */}
								<RolesTable removeRole={removeRoleFromForm} />
							</Grid>
						</Grid>
					</TabPanel>
				</TabContext>
			</Box>
		</AppDialog>
	);
} 