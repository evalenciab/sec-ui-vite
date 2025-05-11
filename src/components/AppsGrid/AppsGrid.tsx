import { Grid, Card, CardContent, Typography, CardActions, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { maintainAppsSchema } from "../../schemas/maintain_apps";
import { UseMutationResult } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ManageAccounts, SupervisorAccount, VerifiedUser } from "@mui/icons-material";
import { AppCard } from "../AppCard";
import { RequestUserForm } from "../RequestUserForm";

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
	const [searchQuery, setSearchQuery] = useState('');
	const [openRequestAccessDialog, setOpenRequestAccessDialog] = useState(false);
	const [appIdToRequestAccess, setAppIdToRequestAccess] = useState<string | null>(null);

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

	const handleOpenRequestAccessDialog = (appId: string) => {
		setAppIdToRequestAccess(appId);
		setOpenRequestAccessDialog(true);
	};

	const handleCloseRequestAccessDialog = () => {
		setAppIdToRequestAccess(null);
		setOpenRequestAccessDialog(false);
	};

	const handleRequestAccessConfirm = () => {
		if (appIdToRequestAccess) {
			//requestAccessMutation.mutate(appIdToRequestAccess);
		}
	};


	const filteredApplications = useMemo(() => {
		if (!searchQuery) {
			return allApplications;
		}
		const lowercasedQuery = searchQuery.toLowerCase();
		return allApplications.filter(app => 
			(app.appName?.toLowerCase().includes(lowercasedQuery)) ||
			(app.appId?.toLowerCase().includes(lowercasedQuery)) ||
			(app.appDescription?.toLowerCase().includes(lowercasedQuery))
		);
	}, [allApplications, searchQuery]);

	if (!allApplications || allApplications.length === 0) {
		return (
			<Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
				No applications to display.
			</Typography>
		);
	}

	return (
		<Grid container spacing={2}>
			<Grid container size={{ xs: 12 }}>
				<Grid size={{ xs: 12, md: 4 }}>
					<TextField
						label="Search by App Name, ID, or Description"
						variant="outlined"
						fullWidth
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						size="small"
					/>
				</Grid>
			</Grid>
			{filteredApplications.map((app) => (
				<AppCard 
					key={app.appId} 
					app={app} 
					deleteApplicationMutation={deleteApplicationMutation} 
					handleOpenDeleteDialog={handleOpenDeleteDialog} 
					handleOpenRequestAccessDialog={handleOpenRequestAccessDialog}
				/>
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
			<RequestUserForm
				appId={appIdToRequestAccess}
				userId={'EVALENCIA'}
				openRequestAccessDialog={openRequestAccessDialog}
				handleCloseRequestAccessDialog={handleCloseRequestAccessDialog}
			/>
		</Grid>
	);
} 