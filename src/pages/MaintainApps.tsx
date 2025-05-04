import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, Grid, Tab, Typography } from "@mui/material";
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

export function MaintainApps() {
	const [tab, setTab] = useState("1");
	const queryClient = useQueryClient();
	const {
		setSelectedApplicationRowData,
		selectedApplicationRowData,
		setAllApplications,
		allApplications,
	} = useApplicationStore();
	const { setSelectedRoleRowData, setAllRoles, allRoles } = useRoleStore();
	const appForm = useForm<z.input<typeof maintainAppsSchema>>({
		resolver: zodResolver(maintainAppsSchema),
		defaultValues: {
			appId: "",
			appName: "",
			appDescription: "",
			deleteInactiveUsers: false,
			retentionDays: undefined,
			roles: [],
		},
	});
	const { handleSubmit, reset, control } = appForm;
	const { append, remove } = useFieldArray({
		control,
		name: "roles",
	});

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
			console.log("Updating existing application (logic needs update):");
			setAllApplications(
				allApplications.map((app) =>
					app.appId === selectedApplicationRowData.appId ? data : app
				)
			);
			enqueueSnackbar("Application updated (local state - needs API)", {
				variant: "info",
			});
			setSelectedApplicationRowData(null);
			reset();
			setAllRoles([]);
		} else {
			console.log("Creating new application via mutation");
			createApplicationMutation.mutate(data);
		}
	};

	const clearForm = () => {
		setSelectedApplicationRowData(null);
		setSelectedRoleRowData(null);
		setAllRoles([]);
		reset();
	};

	useEffect(() => {
		if (selectedApplicationRowData) {
			reset(selectedApplicationRowData);
		} else {
			reset();
		}
	}, [selectedApplicationRowData, reset]);

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
			{createApplicationMutation.isPending && (
				<Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', p: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 10 }}>
					<CircularProgress size={20} sx={{ mr: 1 }} />
					<Typography>Saving application...</Typography>
				</Box>
			)}
			<Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
				<Grid
					size={12}
					sx={{ display: "flex", justifyContent: "center", gap: 2 }}
				>
					<Button
						variant="contained"
						color="secondary"
						size="small"
						onClick={() => {
							clearForm();
						}}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						size="small"
					>
						Save Settings
					</Button>
				</Grid>
			</Box>
			<Grid container spacing={2}>
				<Grid size={12}>
					<AppsTable />
				</Grid>
			</Grid>
		</Box>
	);
}
