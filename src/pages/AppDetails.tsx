import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { applicationService } from "../services/applicationService";
import { Box, Typography, CircularProgress, Paper, Grid, List, ListItem, ListItemText, Divider, Button, Fab, Dialog, DialogTitle, DialogContent } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { z } from "zod";
import { maintainAppsSchema, roleSchema } from "../schemas/maintain_apps"; // Assuming roleSchema is here
import { useState, useMemo } from "react";
import { useAppManagement } from "../hooks/useAppManagement";
import { ApplicationEditorDialog } from "../components/ApplicationEditorDialog/ApplicationEditorDialog";
import { AppUsersGrid } from "../components/AppUsersGrid/AppUsersGrid";
import { mockUsers } from "../data/mock-users";
import { Add } from "@mui/icons-material";
import { UserForm } from "../components/UserForm/UserForm";
import { UserFormData } from "../schemas/userSchema";
import { IUser } from "../types/search";

export function AppDetails() {
	const { appId } = useParams<{ appId: string }>();
	const navigate = useNavigate(); // For potential navigation after edit, though not used here

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [dialogTab, setDialogTab] = useState("1");

	// State for UserForm Dialog
	const [isUserFormOpen, setIsUserFormOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<IUser | null>(null);

	const {
		appForm,
		control,
		appendRoleToForm,
		removeRoleFromForm,
		submitApplicationForm,
		handleSetSelectedApplication,
		handleClearSelectionAndForm,
		selectedApplication, // To determine if the dialog should be in "Edit" mode title
		isSubmittingApplication,
	} = useAppManagement();

	const { data: application, isLoading, isError, error, refetch } = useQuery<z.input<typeof maintainAppsSchema>, Error>({
		queryKey: ["application", appId],
		queryFn: () => {
			if (!appId) {
				throw new Error("Application ID is required");
			}
			return applicationService.fetchApplicationById(appId);
		},
		enabled: !!appId, // Only run query if appId is available
	});

	const watchedRoles = appForm.watch('roles', application?.roles || []);
	const totalRolesForDialog = useMemo(() => watchedRoles.length, [watchedRoles]);

	const handleOpenEditDialog = () => {
		if (application) {
			handleSetSelectedApplication(application); // Load current app data into the form
			setIsEditDialogOpen(true);
			setDialogTab("1");
		}
	};

	const handleCloseEditDialog = () => {
		handleClearSelectionAndForm(); // Clear form and selection state in the hook
		setIsEditDialogOpen(false);
	};

	const handleSaveEditDialog = () => {
		submitApplicationForm(() => {
			setIsEditDialogOpen(false); // Close dialog on successful submission by hook
			refetch(); // Refetch the application details to show updated data
		});
	};

	// Handlers for UserForm Dialog
	const handleOpenUserFormDialog = (user: IUser | null = null) => {
		setEditingUser(user);
		setIsUserFormOpen(true);
	};

	const handleCloseUserFormDialog = () => {
		setIsUserFormOpen(false);
		setEditingUser(null);
	};

	const handleUserFormSubmit = (data: UserFormData) => {
		console.log("User form submitted:", data);
		// Here you would typically call a service to save the user data
		// For mock data, you might update the mockUsers array or a state variable
		// For now, we just log and close
		if (editingUser) {
			// This is an edit
			console.log("Updating user:", editingUser.id, data);
		} else {
			// This is a new user
			console.log("Adding new user:", data);
		}
		// Example: Add to mockUsers (not ideal for real state management)
		// const newUser = { ...data, lastAccess: data.lastAccess || new Date().toISOString(), addedAt: data.addedAt || new Date().toISOString(), addedBy: data.addedBy || 'SYSTEM' };
		// mockUsers.push(newUser);
		// refetchUsers(); // if users were fetched via useQuery
		handleCloseUserFormDialog();
	};

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<Typography variant="h6" color="error">
					Error loading application details: {error?.message || "Unknown error"}
				</Typography>
			</Box>
		);
	}

	if (!application) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<Typography variant="h6">Application not found.</Typography>
			</Box>
		);
	}

	return (
		<Paper elevation={3} sx={{ p: 3, margin: 2 }}>
			<Typography variant="h4" gutterBottom component="div">
				{application.appName}
			</Typography>
			<Divider sx={{ my: 2 }} />
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Typography variant="h6" gutterBottom>
						Application Information
					</Typography>
					<Typography variant="body1"><strong>App ID:</strong> {application.appId}</Typography>
					<Typography variant="body1"><strong>Description:</strong> {application.appDescription}</Typography>
					<Typography variant="body1">
						<strong>Delete Inactive Users:</strong> {application.deleteInactiveUsers ? "Yes" : "No"}
					</Typography>
					{application.deleteInactiveUsers && (
						<Typography variant="body1">
							<strong>Retention Days:</strong> {application.retentionDays}
						</Typography>
					)}
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Typography variant="h6" gutterBottom>
						Roles ({application.roles?.length || 0})
					</Typography>
					{application.roles && application.roles.length > 0 ? (
						<List dense>
							{application.roles.map((role: z.input<typeof roleSchema>) => (
								<ListItem key={role.code} disableGutters>
									<ListItemText
										primary={role.name}
										secondary={
											<>
												<Typography component="span" variant="body2" color="text.primary">
													Code: {role.code}
												</Typography>
												<br />
												{role.description}
											</>
										}
									/>
								</ListItem>
							))}
						</List>
					) : (
						<Typography variant="body1">No roles assigned to this application.</Typography>
					)}
				</Grid>
			</Grid>

			<Divider sx={{ my: 2 }} />
			<Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
				<Typography variant="h5" gutterBottom mb={0}>
					{`Users (${mockUsers.length})`}
				</Typography>
				<Button variant="contained" color="primary" onClick={() => handleOpenUserFormDialog()} startIcon={<Add />} size="small">
					Add User
				</Button>
			</Box>
			<Divider sx={{ my: 2 }} />
			<AppUsersGrid users={mockUsers} />
			<Fab
				color="primary"
				aria-label="edit"
				sx={{ position: 'fixed', bottom: 16, right: 16 }}
				onClick={handleOpenEditDialog}
				disabled={!application || isSubmittingApplication}
			>
				<EditIcon />
			</Fab>

			{isEditDialogOpen && (
				<ApplicationEditorDialog
					open={isEditDialogOpen}
					onClose={handleCloseEditDialog}
					onSave={handleSaveEditDialog}
					dialogTitle={selectedApplication ? "Edit Application" : "Application Details Error"} // Should always be "Edit Application"
					appForm={appForm}
					appendRoleToForm={appendRoleToForm}
					removeRoleFromForm={removeRoleFromForm}
					control={control}
					totalRoles={totalRolesForDialog}
					currentTab={dialogTab}
					onTabChange={(_, newTab) => setDialogTab(newTab)}
				/>
			)}

			{/* Dialog for Adding/Editing User */}
			<Dialog open={isUserFormOpen} onClose={handleCloseUserFormDialog} maxWidth="sm" fullWidth>
				<DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
				<DialogContent>
					<UserForm 
						initialData={editingUser}
						onSubmit={handleUserFormSubmit}
						onClose={handleCloseUserFormDialog}
						isEditMode={!!editingUser}
					/>
				</DialogContent>
			</Dialog>
		</Paper>
	);
} 