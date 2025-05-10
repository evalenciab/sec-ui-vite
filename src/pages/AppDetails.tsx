import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { applicationService } from "../services/applicationService";
import { Box, Typography, CircularProgress, Paper, Grid, List, ListItem, ListItemText, Divider } from "@mui/material";
import { z } from "zod";
import { maintainAppsSchema, roleSchema } from "../schemas/maintain_apps"; // Assuming roleSchema is here

export function AppDetails() {
	const { appId } = useParams<{ appId: string }>();

	const { data: application, isLoading, isError, error } = useQuery<z.input<typeof maintainAppsSchema>, Error>({
		queryKey: ["application", appId],
		queryFn: () => {
			if (!appId) {
				throw new Error("Application ID is required");
			}
			return applicationService.fetchApplicationById(appId);
		},
		enabled: !!appId, // Only run query if appId is available
	});

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
		</Paper>
	);
} 