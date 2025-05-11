import {
	Card,
	CardContent,
	Typography,
	Grid,
	CardActions,
	Button,
} from "@mui/material";
import { ManageAccounts, SupervisorAccount } from "@mui/icons-material";
import { z } from "zod";
import { maintainAppsSchema } from "../schemas/maintain_apps";
import { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface AppCardProps {
	app: z.input<typeof maintainAppsSchema>;
	handleOpenDeleteDialog: (appId: string) => void;
	handleOpenRequestAccessDialog: (appId: string) => void;
	deleteApplicationMutation: UseMutationResult<
		{ success: boolean; appId: string },
		Error,
		string,
		unknown
	>;
}
export function AppCard({ app, deleteApplicationMutation, handleOpenDeleteDialog, handleOpenRequestAccessDialog }: AppCardProps) {
	const navigate = useNavigate();
	const isLoading = deleteApplicationMutation.isPending;
	return (
		<Grid size={{ xs: 12, sm: 6, md: 4 }} key={app.appId || app.appName}>
			<Card
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: "100%",
				}}
			>
				<CardContent>
					<Typography variant="h6" component="div">
						{app.appName}
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						ID: {app.appId}
					</Typography>
					<Grid container alignItems="center" spacing={1}>
						<ManageAccounts />
						<Typography variant="body2" color="text.secondary">
							Don Fermin
						</Typography>
					</Grid>
					<Grid container alignItems="center" spacing={1}>
						<SupervisorAccount />
						<Typography variant="body2" color="text.secondary">
							Don Fermin, Ceferino
						</Typography>
					</Grid>
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
						disabled={isLoading}
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
						disabled={isLoading}
					>
						View Details
					</Button>
					<Button
						size="small"
						variant="outlined"
						onClick={() => {
							if (app.appId) {
								handleOpenRequestAccessDialog(app.appId);
							}
						}}
						disabled={isLoading}
					>
						Request Access
					</Button>
				</CardActions>
			</Card>
		</Grid>
	);
}
