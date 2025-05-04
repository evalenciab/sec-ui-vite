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
import { useQuery } from "@tanstack/react-query";
import { applicationService } from "../services/applicationService";

export function MaintainApps() {
	const [tab, setTab] = useState("1");
	const {
		setSelectedApplicationRowData,
		selectedApplicationRowData,
		setAllApplications,
		allApplications,
	} = useApplicationStore();
	const { setSelectedRoleRowData, setAllRoles, allRoles } = useRoleStore();
	const appForm = useForm<z.input<typeof maintainAppsSchema>>({
		resolver: zodResolver(maintainAppsSchema),
	});
	const { handleSubmit, reset } = appForm;
	const { append, remove } = useFieldArray({
		control: appForm.control,
		name: "roles",
	});

	const { data: fetchedApplications, isLoading, isError } = useQuery({
		queryKey: ["applications"],
		queryFn: applicationService.fetchApplications,
	});

	useEffect(() => {
		if (fetchedApplications) {
			setAllApplications(fetchedApplications);
		}
	}, [fetchedApplications, setAllApplications]);

	useEffect(() => {
		if (selectedApplicationRowData) {
			setAllRoles(selectedApplicationRowData.roles || []);
		} else if (!isLoading && !isError && fetchedApplications && !selectedApplicationRowData) {
			setAllRoles([]);
		}
	}, [selectedApplicationRowData, setAllRoles, fetchedApplications, isLoading, isError]);

	const totalRoles = useMemo(() => {
		const currentRoles = selectedApplicationRowData?.roles || allRoles;
		return currentRoles.length;
	}, [selectedApplicationRowData, allRoles]);

	const onSubmit = (data: z.input<typeof maintainAppsSchema>) => {
		console.log(data);
		if (selectedApplicationRowData) {
			setAllApplications(
				allApplications.map((app) =>
					app.appId === selectedApplicationRowData.appId ? data : app
				)
			);
			enqueueSnackbar("Application updated successfully", {
				variant: "success",
			});
		} else {
			if (allApplications.some((app) => app.appId === data.appId)) {
				enqueueSnackbar("Application already exists", {
					variant: "error",
				});
				return;
			}
			console.log("Creating new application");
			console.log(`Role: ${JSON.stringify(data.roles)}`);
			setAllApplications([...allApplications, data]);
			enqueueSnackbar("Application created successfully", {
				variant: "success",
			});
		}
		setSelectedApplicationRowData(null);
		reset({
			appId: "",
			appName: "",
			appDescription: "",
			deleteInactiveUsers: false,
			retentionDays: 0,
			roles: [],
		});
		setSelectedRoleRowData(null);
		setAllRoles([]);
	};

	const clearForm = () => {
		setSelectedApplicationRowData(null);
		setSelectedRoleRowData(null);
		setAllRoles([]);
		reset({
			appId: "",
			appName: "",
			appDescription: "",
			deleteInactiveUsers: false,
			retentionDays: 0,
			roles: [],
		});
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
