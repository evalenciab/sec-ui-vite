import { Grid, Card, CardContent, Typography, CardActions, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { maintainAppsSchema } from "../../schemas/maintain_apps";
import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

interface AppsGridProps {
	allApplications: z.input<typeof maintainAppsSchema>[];
	deleteApplicationMutation: UseMutationResult<
		{ success: boolean; appId: string },
		Error,
		string,
		unknown
	>;
}

export function AppsGrid({ allApplications, deleteApplicationMutation }: AppsGridProps) {
	const navigate = useNavigate();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [appIdToDelete, setAppIdToDelete] = useState<string | null>(null);

	const handleOpenDeleteDialog = (appId: string) => {
		setAppIdToDelete(appId);
		setOpenDeleteDialog(true);
	};

	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
		setAppIdToDelete(null);
	};

	const handleDeleteConfirm = () => {
		if (appIdToDelete) {
			deleteApplicationMutation.mutate(appIdToDelete, {
				onSuccess: () => {
					handleCloseDeleteDialog();
				},
				onError: () => {
					handleCloseDeleteDialog();
				}
			});
		}
	};

	if (!allApplications || allApplications.length === 0) {
		return (
			<Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
				No applications to display.
			</Typography>
		);
	}

	return (
		<Grid container spacing={2}>
			{allApplications.map((app) => (
				<Grid size={{ xs: 12, sm: 6, md: 4 }} key={app.appId || app.appName}>
					<Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
						<CardContent>
							<Typography variant="h6" component="div">
								{app.appName}
							</Typography>
							<Typography sx={{ mb: 1.5 }} color="text.secondary">
								ID: {app.appId}
							</Typography>
							<Typography variant="body2" sx={{ mb: 1, flexGrow: 1 }}>
								{app.appDescription}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Total Roles: {app.roles?.length || 0}
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: "flex-end" }}>
							<Button
								size="small"
								variant="outlined"
								color="error"
								disabled={deleteApplicationMutation.isPending}
								onClick={() => {
									if (app.appId) {
										handleOpenDeleteDialog(app.appId);
									}
								}}
							>
								Delete
							</Button>
							<Button
								size="small"
								variant="contained"
								onClick={() => navigate(`/app-details/${app.appId}`)}
								disabled={deleteApplicationMutation.isPending}
							>
								View Details
							</Button>
						</CardActions>
					</Card>
				</Grid>
			))}
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
					<Button onClick={handleDeleteConfirm} color="error" disabled={deleteApplicationMutation.isPending}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
} 