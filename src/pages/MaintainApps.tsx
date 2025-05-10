import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, Grid, Tab, Typography, Switch, FormControlLabel, Card, CardContent, CardActions } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { maintainAppsSchema } from "../schemas/maintain_apps";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AppForm } from "../components/AppForm/AppForm";
import { RolesForm } from "../components/RolesForm";
import { RolesTable } from "../components/RolesTable";
import { useApplicationStore } from "../stores/application.store";
import { AppsTable } from "../components/AppsTable";
import { useRoleStore } from "../stores/roles.store";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "../services/applicationService";
import { AppDialog } from "../components/AppDialog/AppDialog";
import { useNavigate } from "react-router-dom";
import { AppsGrid } from "../components/AppsGrid/AppsGrid";

// Define default values shape based on schema input
const defaultFormValues: z.input<typeof maintainAppsSchema> = {
	appId: "",
	appName: "",
	appDescription: "",
	deleteInactiveUsers: false,
	retentionDays: undefined, // Match schema/preference
	roles: [],
};

export function MaintainApps() {
	const [tab, setTab] = useState("1");
	const [openCreateAppDialog, setOpenCreateAppDialog] = useState(false);
	const queryClient = useQueryClient();
	const {
		setSelectedApplicationRowData,
		selectedApplicationRowData,
		setAllApplications,
		allApplications,
		viewMode,
		setViewMode,
	} = useApplicationStore();
	const { setSelectedRoleRowData, setAllRoles, allRoles } = useRoleStore();
	const appForm = useForm<z.input<typeof maintainAppsSchema>>({
		resolver: zodResolver(maintainAppsSchema),
		defaultValues: defaultFormValues, // Use the defined object
	});
	const { handleSubmit, reset, control, trigger } = appForm;
	const { append, remove } = useFieldArray({
		control,
		name: "roles",
	});
	const navigate = useNavigate();

	const { data: fetchedApplications, isLoading, isError } = useQuery({
		queryKey: ["applications"],
		queryFn: applicationService.fetchApplications,
	});

	const createApplicationMutation = useMutation({
		mutationFn: applicationService.createApplication,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			enqueueSnackbar(`Application '${data.appName}' created successfully`, {
				variant: "success",
			});
			clearForm();
		},
		onError: (error) => {
			console.error("Error creating application:", error);
			enqueueSnackbar(`Error creating application: ${error.message}`, {
				variant: "error",
			});
		},
	});

	const updateApplicationMutation = useMutation({
		mutationFn: applicationService.updateApplication,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			enqueueSnackbar(`Application '${data.appName}' updated successfully`, {
				variant: "success",
			});
			clearForm();
		},
		onError: (error) => {
			console.error("Error updating application:", error);
			enqueueSnackbar(`Error updating application: ${error.message}`, {
				variant: "error",
			});
		},
	});

	const deleteApplicationMutation = useMutation({
		mutationFn: applicationService.deleteApplication,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			enqueueSnackbar(`Application with ID ${data.appId} deleted successfully`, {
				variant: "success",
			});
		},
		onError: (error) => {
			console.error("Error deleting application:", error);
			enqueueSnackbar(`Error deleting application: ${error.message}`, {
				variant: "error",
			});
		},
	});

	useEffect(() => {
		if (fetchedApplications) {
			setAllApplications(fetchedApplications);
		}
	}, [fetchedApplications, setAllApplications]);

	useEffect(() => {
		if (selectedApplicationRowData) {
			setAllRoles(selectedApplicationRowData.roles || []);
		} else {
			setAllRoles([]);
		}
	}, [selectedApplicationRowData, setAllRoles]);

	const totalRoles = useMemo(() => {
		const currentRoles = selectedApplicationRowData?.roles || allRoles;
		return currentRoles.length;
	}, [selectedApplicationRowData, allRoles]);

	const onSubmit = (data: z.input<typeof maintainAppsSchema>) => {
		console.log("Submitting data:", data);
		if (selectedApplicationRowData) {
			console.log("Updating existing application via mutation");
			const updateData = { ...data, appId: selectedApplicationRowData.appId };
			updateApplicationMutation.mutate(updateData);
		} else {
			console.log("Creating new application via mutation");
			createApplicationMutation.mutate(data);
		}
	};

	const onSubmitDialog = () => {
		trigger();
		if (appForm.formState.isValid) {
			const data = appForm.getValues();
			console.log("Submitting data:", data);
			if (selectedApplicationRowData) {
				console.log("Updating existing application via mutation");
				const updateData = { ...data, appId: selectedApplicationRowData.appId };
				updateApplicationMutation.mutate(updateData);
			} else {
				console.log("Creating new application via mutation");
				createApplicationMutation.mutate(data);
			}
		} else {
			enqueueSnackbar("Please fill in all required fields", {
				variant: "error",
			});
		}
	};

	const clearForm = () => {
		setTab("1");
		setSelectedApplicationRowData(null);
		setSelectedRoleRowData(null);
		setAllRoles([]);
		reset(defaultFormValues);
		setOpenCreateAppDialog(false);
	};

	useEffect(() => {
		if (selectedApplicationRowData) {
			reset(selectedApplicationRowData);
		} else {
			reset(defaultFormValues);
		}
	}, [selectedApplicationRowData, reset]);

	const handleViewModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setViewMode(event.target.checked ? "cards" : "table");
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
				<Typography variant="h6">Error loading applications.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			{(createApplicationMutation.isPending || updateApplicationMutation.isPending) && (
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
					<Button variant="contained" color="primary" size="small" onClick={() => setOpenCreateAppDialog(true)}>
						Create Application
					</Button>
					<AppDialog
						title="Create Application"
						open={openCreateAppDialog}
						onClose={() => {
							setOpenCreateAppDialog(false);
							clearForm();
						}}
						onSave={() => {
							onSubmitDialog();
						}}
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
											<RolesForm appendRole={append} />
										</Grid>
										<Grid size={8}>
											<RolesTable removeRole={remove} />
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
						<AppsTable deleteApplicationMutation={deleteApplicationMutation} />
					) : (
						<AppsGrid allApplications={allApplications} deleteApplicationMutation={deleteApplicationMutation} />
					)}
				</Grid>
			</Grid>
		</Box>
	);
}
