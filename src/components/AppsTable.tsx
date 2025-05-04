import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useApplicationStore } from "../stores/application.store";
import { maintainAppsSchema } from "../schemas/maintain_apps";
import { z } from "zod";
import { roleSchema } from "../schemas/maintain_apps";
import { Button, Box, IconButton, Dialog, DialogContentText, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

interface ApplicationGridRow extends GridRowModel {
	id: string;
	appId: string;
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
		appId: application.appId || "",
		appName: application.appName || "",
		appDescription: application.appDescription || "",
		deleteInactiveUsers: application.deleteInactiveUsers || false,
		retentionDays: application.retentionDays || 0,
		roles: application.roles || [],
		originalApplication: application,
	}));
};

const generateRolesGridRows = (roles: z.input<typeof roleSchema>[]) => {
	return roles.map((role) => ({
		id: role.code || "",
		code: role.code || "",
		name: role.name || "",
		description: role.description || "",
		accessType: role.accessType || [],
		secureTo: role.secureTo || [],
		originalRole: role,
	}));
};




export function AppsTable() {
	const { allApplications, setSelectedApplicationRowData, setAllApplications } = useApplicationStore();
	const [open, setOpen] = useState(false);
	const [openRolesDialog, setOpenRolesDialog] = useState(false);
	const [application, setApplication] = useState<z.input<typeof maintainAppsSchema> | null>(null);
	const [appId, setAppId] = useState("");
	const deleteApplication = (appId: string) => {
		setAllApplications(allApplications.filter(app => app.appId !== appId));
		setOpen(false);
		setSelectedApplicationRowData({
			appId: '',
			appName: '',
			appDescription: '',
			deleteInactiveUsers: false,
			retentionDays: 0,
			roles: [],
		});
		enqueueSnackbar("Application deleted successfully", { variant: "success" });
	};
	
	const editApplication = (application: z.input<typeof maintainAppsSchema>) => {
		console.log(application);
		setSelectedApplicationRowData(application);
	};
	const handleOpenDeleteDialog = (appId: string) => {
		setAppId(appId);
		setOpen(true);
	};
	const handleOpenRolesDialog = (application: z.input<typeof maintainAppsSchema>) => {
		console.log(application);
		setApplication(application);
		setOpenRolesDialog(true);
	};


	const columns: GridColDef<ApplicationGridRow>[] = [
		{ field: "appId", headerName: "App ID", width: 100 },
		{ field: "appName", headerName: "App Name", width: 200 },
		{ field: "appDescription", headerName: "App Description", width: 200 },
		{
			field: "deleteInactiveUsers",
			headerName: "Delete Inactive Users",
			width: 150,
		},
		{ field: "retentionDays", headerName: "Retention Days", width: 150 },
		{
			field: "roles",
			headerName: "Roles",
			width: 100,
			renderCell: (params) => {
				return (
					<IconButton onClick={() => handleOpenRolesDialog(params.row.originalApplication)}>
						<Visibility />
					</IconButton>
				);
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
						<IconButton onClick={() => editApplication(params.row.originalApplication)}>
							<Edit />
						</IconButton>
						<IconButton onClick={() => handleOpenDeleteDialog(params.row.appId)}>
							<Delete />
						</IconButton>
					</Box>
				);
			},
		},
	];
	const rolesColumns: GridColDef[] = [
		{ field: 'code', headerName: 'Code', width: 150 },
		{ field: 'name', headerName: 'Name', width: 150 },
		{ field: 'description', headerName: 'Description', width: 200 },
		{ field: 'accessType', headerName: 'Access Type', width: 180 },
		{ field: 'secureTo', headerName: 'Secure To', width: 180 },
	];
	const gridRows = generateGridRows(allApplications);
	return (
		<>
			<DataGrid rows={gridRows} columns={columns} density="compact" />
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Delete Application</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this application?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={() => deleteApplication(appId)}>Delete</Button>
				</DialogActions>

			</Dialog>
			<Dialog open={openRolesDialog} onClose={() => setOpenRolesDialog(false)} maxWidth="xl" fullWidth>
				<DialogTitle>Roles for {application?.appName}</DialogTitle>
				<DialogContent>
					<DataGrid
						rows={generateRolesGridRows(application?.roles || [])}
						columns={rolesColumns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 10 },
							},
						}}
						pageSizeOptions={[10, 25, 50]}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
