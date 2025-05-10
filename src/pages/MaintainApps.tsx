import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, Grid, Tab, Typography, Switch, FormControlLabel } from "@mui/material";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AppForm } from "../components/AppForm/AppForm";
import { RolesForm } from "../components/RolesForm";
import { RolesTable } from "../components/RolesTable";
import { useApplicationStore } from "../stores/application.store";
import { AppsTable } from "../components/AppsTable";
import { useRoleStore } from "../stores/roles.store";
import { AppDialog } from "../components/AppDialog/AppDialog";
import { useNavigate } from "react-router-dom";
import { AppsGrid } from "../components/AppsGrid/AppsGrid";
import { useAppManagement } from "../hooks/useAppManagement";
import { maintainAppsSchema } from "../schemas/maintain_apps";

export function MaintainApps() {
	const [tab, setTab] = useState("1");
	const [openCreateAppDialog, setOpenCreateAppDialog] = useState(false);
	const { viewMode, setViewMode } = useApplicationStore();
	const { allRoles: rolesFromStore } = useRoleStore();

	const {
		applications,
		isLoadingApplications,
		isErrorApplications,
		appForm,
		control,
		appendRoleToForm,
		removeRoleFromForm,
		deleteApplication,
		submitApplicationForm,
		handleSetSelectedApplication,
		handleClearSelectionAndForm,
		selectedApplication,
		isSubmittingApplication,
	} = useAppManagement();

	const totalRoles = useMemo(() => {
		const currentRoles = selectedApplication?.roles || rolesFromStore;
		return currentRoles.length;
	}, [selectedApplication, rolesFromStore]);

	const handleSubmitDialog = () => {
		submitApplicationForm(() => {
			setOpenCreateAppDialog(false);
		});
	};

	const handleClearDialogAndForm = () => {
		handleClearSelectionAndForm(() => {
			setOpenCreateAppDialog(false);
			setTab("1");
		});
	};

	const handleViewModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setViewMode(event.target.checked ? "cards" : "table");
	};

	if (isLoadingApplications) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isErrorApplications) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<Typography variant="h6">Error loading applications.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			{isSubmittingApplication && (
				<Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', p: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 10 }}>
					<CircularProgress size={20} sx={{ mr: 1 }} />
					<Typography>Saving application...</Typography>
				</Box>
			)}
			<Grid container spacing={2} sx={{ alignItems: "center" }}>
				<Grid size={{xs: 6}}>
					<FormControlLabel
						control={
							<Switch
								checked={viewMode === "cards"}
								onChange={handleViewModeChange}
								name="viewModeSwitch"
								color="primary"
							/>
						}
						label="Card View"
					/>
				</Grid>
				<Grid size={{xs: 6}} sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Button variant="contained" color="primary" size="small" onClick={() => {
						handleClearSelectionAndForm();
						setOpenCreateAppDialog(true);
						setTab("1");
					}}>
						Create Application
					</Button>
					<AppDialog
						title={selectedApplication ? "Edit Application" : "Create Application"}
						open={openCreateAppDialog}
						onClose={handleClearDialogAndForm}
						onSave={handleSubmitDialog}
					>
						<Box component="form" noValidate>
							<TabContext value={tab}>
								<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
									<TabList
										onChange={(_, newValue) => setTab(newValue)}
										aria-label="basic tabs example"
									>
										<Tab label="Application Settings" value={"1"} />
										<Tab label={`Roles (${totalRoles})`} value={"2"} />
									</TabList>
								</Box>
								<TabPanel value={"1"}>
									<AppForm form={appForm} />
								</TabPanel>
								<TabPanel value={"2"}>
									<Grid container spacing={2}>
										<Grid size={4}>
											<RolesForm appendRole={appendRoleToForm} />
										</Grid>
										<Grid size={8}>
											<RolesTable removeRole={removeRoleFromForm} />
										</Grid>
									</Grid>
								</TabPanel>
							</TabContext>

						</Box>
					</AppDialog>
				</Grid>
			</Grid>

			<Grid container spacing={2}>
				<Grid size={{xs: 12}}>
					{viewMode === "table" ? (
						<AppsTable 
							deleteApplicationMutation={deleteApplication} 
							onEdit={(appData: z.input<typeof maintainAppsSchema>) => {
								handleSetSelectedApplication(appData); 
								setOpenCreateAppDialog(true);
								setTab("1");
							}}
						/>
					) : (
						<AppsGrid 
							allApplications={applications} 
							deleteApplicationMutation={deleteApplication} 
						/>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}
