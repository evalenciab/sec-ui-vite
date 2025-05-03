import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
	MaintainAppsFormData,
	maintainAppsSchema,
	roleSchema,
} from "../schemas/maintain_apps";
import { z } from "zod";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AppForm } from "../components/AppForm/AppForm";
import { RolesForm } from "../components/RolesForm";
import { RolesTable } from "../components/RolesTable";
import { useApplicationStore } from "../stores/application.store";
import { AppsTable } from "../components/AppsTable";
export function MaintainApps() {
	const [tab, setTab] = useState("1");
	const { setSelectedApplicationRowData, selectedApplicationRowData, setAllApplications, allApplications } = useApplicationStore();
	const appForm = useForm<z.input<typeof maintainAppsSchema>>({
		resolver: zodResolver(maintainAppsSchema),
	});
	const { handleSubmit, reset } = appForm;
	const { fields, append, remove } = useFieldArray({
		control: appForm.control,
		name: "roles",
	});

	//const watchDeleteInactiveUsers = watch("deleteInactiveUsers");

	const onSubmit = (data: z.input<typeof maintainAppsSchema>) => {
		console.log(data);
		// Handle form submission logic here (e.g., API call)
		setAllApplications([...allApplications, data]);
		// Reset the form to default values and clear the selected application row data
		setSelectedApplicationRowData(null);
		reset(
			{
				appId: '',
				appName: '',
				appDescription: '',
				deleteInactiveUsers: false,
				retentionDays: 0,
				roles: [],
					
			}
		);
	};

	const editRole = (role: z.input<typeof roleSchema>) => {
		console.log(role);
		
		//setTempRole(role);
	};

	const deleteRole = (roleCode: string) => {
		console.log(roleCode);
	};

	const clearForm = () => {
		/*setTempRole({
			code: '',
			name: '',
			description: '',
			accessType: [],
			secureTo: [],
		});*/
	};

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
							<Tab label="Roles" value={"2"} />
						</TabList>
					</Box>
					<TabPanel value={"1"}>
						<AppForm form={appForm} />
					</TabPanel>
					<TabPanel value={"2"}>
						<Grid container spacing={2}>
							<Grid size={4}>
								<RolesForm appendRole={append} clearForm={clearForm} />
							</Grid>
							<Grid size={8}>
								<RolesTable roles={fields} editRole={editRole} deleteRole={deleteRole} />
							</Grid>
						</Grid>
					</TabPanel>
				</TabContext>
				<Grid
					size={12}
					sx={{ display: "flex", justifyContent: "center", gap: 2 }}
				>
					<Button variant="contained" color="secondary" size="small">
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
