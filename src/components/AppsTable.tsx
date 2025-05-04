import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useApplicationStore } from "../stores/application.store";
import { maintainAppsSchema } from "../schemas/maintain_apps";
import { z } from "zod";
import { roleSchema } from "../schemas/maintain_apps";
import { Button, Box, IconButton, Dialog, DialogContentText, DialogContent, DialogTitle, DialogActions, CircularProgress } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useRoleStore } from "../stores/roles.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "../services/applicationService";

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
	const queryClient = useQueryClient();
	const { allApplications, setSelectedApplicationRowData, selectedApplicationRowData } = useApplicationStore();
	const { setAllRoles } = useRoleStore();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openRolesDialog, setOpenRolesDialog] = useState(false);
	const [applicationForRoles, setApplicationForRoles] = useState<z.input<typeof maintainAppsSchema> | null>(null);
	const [appIdToDelete, setAppIdToDelete] = useState<string | null>(null);

	const deleteApplicationMutation = useMutation({
		mutationFn: applicationService.deleteApplication,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			enqueueSnackbar(`Application with ID ${data.appId} deleted successfully`, {
				variant: "success",
			});
			setOpenDeleteDialog(false);
			setAppIdToDelete(null);
			if (selectedApplicationRowData?.appId === data.appId) {
				setSelectedApplicationRowData(null);
				setAllRoles([]);
			}
		},
		onError: (error) => {
			console.error("Error deleting application:", error);
			enqueueSnackbar(`Error deleting application: ${error.message}`, {
				variant: "error",
			});
			setOpenDeleteDialog(false);
			setAppIdToDelete(null);
		},
	});

	const handleDeleteConfirm = () => {
		if (appIdToDelete) {
			deleteApplicationMutation.mutate(appIdToDelete);
		}
	};

	const editApplication = (application: z.input<typeof maintainAppsSchema>) => {
		console.log("Editing application:", application);
		setSelectedApplicationRowData(application);
		setAllRoles(application.roles || []);
	};

	const handleOpenDeleteDialog = (appId: string) => {
		setAppIdToDelete(appId);
		setOpenDeleteDialog(true);
	};

	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
		setAppIdToDelete(null);
	};

	const handleOpenRolesDialog = (application: z.input<typeof maintainAppsSchema>) => {
		setApplicationForRoles(application);
		setOpenRolesDialog(true);
	};
	
	const handleCloseRolesDialog = () => {
		setOpenRolesDialog(false);
		setApplicationForRoles(null);
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
						<IconButton onClick={() => handleOpenDeleteDialog(params.row.appId)} disabled={deleteApplicationMutation.isPending}>
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
		{ field: 'accessType', headerName: 'Access Type', width: 180, valueGetter: (value: string[]) => value.join(', ') },
		{ field: 'secureTo', headerName: 'Secure To', width: 180, valueGetter: (value: string[]) => value.join(', ') },
	];
	const gridRows = generateGridRows(allApplications);
	return (
		<>
			<DataGrid rows={gridRows} columns={columns} density="compact" autoHeight />
			<Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
				<DialogTitle>Delete Application</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete application ID: {appIdToDelete}?
					</DialogContentText>
					{deleteApplicationMutation.isPending && (
						<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
							<CircularProgress />
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteDialog} disabled={deleteApplicationMutation.isPending}>
						Cancel
					</Button>
					<Button onClick={handleDeleteConfirm} disabled={deleteApplicationMutation.isPending} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={openRolesDialog} onClose={handleCloseRolesDialog} maxWidth="lg" fullWidth>
				<DialogTitle>Roles for {applicationForRoles?.appName}</DialogTitle>
				<DialogContent>
					<DataGrid
						rows={generateRolesGridRows(applicationForRoles?.roles || [])}
						columns={rolesColumns}
						autoHeight
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 5 },
							},
						}}
						pageSizeOptions={[5, 10, 25]}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseRolesDialog}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
