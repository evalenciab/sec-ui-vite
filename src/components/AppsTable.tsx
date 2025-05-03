import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useApplicationStore } from "../stores/application.store";
import { maintainAppsSchema } from "../schemas/maintain_apps";
import { z } from "zod";
import { roleSchema } from "../schemas/maintain_apps";
import { Button, Box, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
interface ApplicationGridRow extends GridRowModel {
	id: string;
	appName: string;
	appDescription: string;
	roles: z.input<typeof roleSchema>[];
	deleteInactiveUsers: boolean;
	retentionDays: number;
	originalApplication: z.input<typeof maintainAppsSchema>;
}

const generateGridRows = (
	applications: z.input<typeof maintainAppsSchema>[]
): ApplicationGridRow[] => {
	return applications.map((application) => ({
		id: application.appId || "",
		appName: application.appName || "",
		appDescription: application.appDescription || "",
		deleteInactiveUsers: application.deleteInactiveUsers || false,
		retentionDays: application.retentionDays || 0,
		roles: application.roles || [],
		originalApplication: application,
	}));
};

export function AppsTable() {
	const { allApplications } = useApplicationStore();
	const columns: GridColDef<ApplicationGridRow>[] = [
		{ field: "appId", headerName: "App ID", width: 100 },
		{ field: "appName", headerName: "App Name", width: 100 },
		{ field: "appDescription", headerName: "App Description", width: 100 },
		{
			field: "deleteInactiveUsers",
			headerName: "Delete Inactive Users",
			width: 100,
		},
		{ field: "retentionDays", headerName: "Retention Days", width: 100 },
		{
			field: "roles",
			headerName: "Roles",
			width: 100,
			renderCell: (params) => {
				return params.row.roles.map((role) => role.name).join(", ");
			},
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 100,
			renderCell: (params) => {
				return (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<IconButton>
							<Edit />
						</IconButton>
						<IconButton>
							<Delete />
						</IconButton>
					</Box>
				);
			},
		},
	];
	const gridRows = generateGridRows(allApplications);
	return <DataGrid rows={gridRows} columns={columns} />;
}
