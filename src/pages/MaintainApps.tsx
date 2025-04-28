import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
	Grid,
	IconButton,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
	MaintainAppsFormData,
	maintainAppsSchema,
} from "../schemas/maintain_apps";
import { z } from "zod";
import { IAccessTypeOption, IUserOption } from "../types/search";
import { Autocomplete } from "@mui/material";
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp, GridToolbar } from "@mui/x-data-grid";
const userOptions: IUserOption[] = [
	{ id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' },
	{ id: 'JDOE', label: 'John Doe (JDOE)' },
	{ id: 'ASMITH', label: 'Alice Smith (ASMITH)' },
];
const accessTypeMap = {
	EMPLOYEE: { code: 'EMPLOYEE', label: 'Employee' },
	CUSTOMER: { code: 'CUSTOMER', label: 'Customer' },
};
const accessTypeOptions: IAccessTypeOption[] = [
	{ id: accessTypeMap.EMPLOYEE.code, label: accessTypeMap.EMPLOYEE.label },
	{ id: accessTypeMap.CUSTOMER.code, label: accessTypeMap.CUSTOMER.label },
];
const rows: GridRowsProp = [
	{ id: 1, appName: 'Reliquias App', appDescription: 'Reliquias App Description', deleteInactiveUsers: false, retentionDays: 0, businessOwner: { id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }, applicationAdmins: [{ id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }], status: 'Active', totalUsers: 100 },
	{ id: 2, appName: 'Reliquias App 2', appDescription: 'Reliquias App Description 2', deleteInactiveUsers: false, retentionDays: 0, businessOwner: { id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }, applicationAdmins: [{ id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }], status: 'Active', totalUsers: 200 },
	{ id: 3, appName: 'Reliquias App 3', appDescription: 'Reliquias App Description 3', deleteInactiveUsers: false, retentionDays: 0, businessOwner: { id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }, applicationAdmins: [{ id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }], status: 'Active', totalUsers: 100 },
	{ id: 4, appName: 'Reliquias App 4', appDescription: 'Reliquias App Description 4', deleteInactiveUsers: false, retentionDays: 0, businessOwner: { id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }, applicationAdmins: [{ id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }], status: 'Active', totalUsers: 300 },
	{ id: 5, appName: 'Reliquias App 5', appDescription: 'Reliquias App Description 5', deleteInactiveUsers: false, retentionDays: 0, businessOwner: { id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }, applicationAdmins: [{ id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }], status: 'Active', totalUsers: 100 },
	{ id: 6, appName: 'Reliquias App 6', appDescription: 'Reliquias App Description 6', deleteInactiveUsers: false, retentionDays: 0, businessOwner: { id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }, applicationAdmins: [{ id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' }], status: 'Active', totalUsers: 500 },
];
const columns: GridColDef[] = [
    { field: 'appName', headerName: 'Application', width: 200 },
	{ field: 'appDescription', headerName: 'Description', width: 200 },
	{ field: 'deleteInactiveUsers', headerName: 'Delete Inactive Users', width: 200 },
	{ field: 'retentionDays', headerName: 'Retention Days', width: 200 },
	{ field: 'businessOwner', headerName: 'Business Owner', width: 200, renderCell: (params: GridRenderCellParams) => params.row.businessOwner?.label },
	{ field: 'applicationAdmins', headerName: 'Application Admins', width: 200, renderCell: (params: GridRenderCellParams) => params.row.applicationAdmins?.map((admin: IUserOption) => admin?.label).join(', ') },
	{ field: 'totalUsers', headerName: 'Total Users', width: 100, align: 'center' },
	{ field: 'status', headerName: 'Status', width: 100, align: 'center' },
	{
		field: 'actions',
		headerName: 'Actions',
		width: 150,
		align: 'center',
		sortable: false,
		disableColumnMenu: true,
		renderCell: (params: GridRenderCellParams) => {
			const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();
				console.log('Edit clicked for row:', params.id);
				// TODO: Implement edit logic (e.g., open modal, navigate to edit page)
			};

			const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();
				console.log('Delete clicked for row:', params.id);
				// TODO: Implement delete logic (e.g., show confirmation, call API)
			};

			return (
				<Box>
					<IconButton onClick={handleEdit} color="primary">
						<Edit />
					</IconButton>
					<IconButton onClick={handleDelete} color="error">
						<Delete />
					</IconButton>
				</Box>
			);
		},
	},
];
export function MaintainApps() {
	const {
		control,
		handleSubmit,
		register,
		watch,
		setValue,
		formState: { errors },
	} = useForm<z.input<typeof maintainAppsSchema>>({
		resolver: zodResolver(maintainAppsSchema),
		defaultValues: {
			appName: 'Reliquias App',
			appDescription: '',
			deleteInactiveUsers: false,
			retentionDays: 0,
			businessOwner: {
				id: '',
				label: '',
			},
			roles: [],

		},
	});
	console.log(errors);
	const watchDeleteInactiveUsers = watch("deleteInactiveUsers");
	const watchRoles = watch("roles");

	const onSubmit = (data: z.input<typeof maintainAppsSchema>) => {
		console.log(data);
		// Handle form submission logic here (e.g., API call)
	};

	const handleAddRole = () => {
		setValue("roles", [...watchRoles ?? [], { code: "", name: "", description: "", accessType: accessTypeOptions[0] }]);
	};

	const handleRemoveRole = (index: number) => {
		setValue("roles", watchRoles?.filter((_, i) => i !== index));
	};

	return (
		<>
			<Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6 }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<Typography variant="h5" component="h1" gutterBottom>
								Maintain App Settings
							</Typography>
							<TextField
								label="App Name"
								{...register("appName")}
								error={!!errors.appName}
								helperText={errors.appName?.message}
								required
								fullWidth
								size="small"
							/>
							<TextField
								label="App Description"
								{...register("appDescription")}
								error={!!errors.appDescription}
								helperText={errors.appDescription?.message}
								multiline
								rows={2}
								fullWidth
								size="small"
								sx={{ mt: 2 }}
							/>
							<FormGroup sx={{ mt: 2 }}>
								<Controller
									name="deleteInactiveUsers"
									control={control}
									render={({ field }) => (
										<FormControlLabel
											control={
												<Checkbox
													{...field}
													checked={field.value ?? false}
												/>
											}
											label="Delete Inactive Users"
										/>
									)}
								/>
							</FormGroup>
							{watchDeleteInactiveUsers && (
								<TextField
									label="Retention Days"
									type="number"
									{...register("retentionDays", {
										valueAsNumber: true,
									})}
									error={!!errors.retentionDays}
									helperText={errors.retentionDays?.message}
									required={watchDeleteInactiveUsers}
									fullWidth
									size="small"
									InputProps={{ inputProps: { min: 1 } }}
								/>
							)}
							<Controller
								name="businessOwner"
								control={control}
								render={({ field }) => (
									<Autocomplete
										{...field}
										options={userOptions}
										getOptionLabel={(option) => option?.label || ''}
										isOptionEqualToValue={(option, value) => option.id === value.id}
										onChange={(_, data) => field.onChange(data)} // Pass the selected option object or null
										renderInput={(params) => (
											<TextField
												{...params}
												label="Business Owner"
												variant="outlined"
												error={!!errors.businessOwner}
												helperText={errors.businessOwner?.message}
												size="small"
												sx={{ mt: 2 }}
											/>
										)}
									/>
								)}
							/>
							<Controller
								name="applicationAdmins"
								control={control}
								render={({ field }) => (
									<Autocomplete
										{...field}
										options={userOptions}
										getOptionLabel={(option) => option?.label || ''}
										multiple
										renderInput={(params) => (
											<TextField
												{...params}
												label="Application Admins"
												variant="outlined"
												error={!!errors.applicationAdmins}
												helperText={errors.applicationAdmins?.message}
												size="small"
												sx={{ my: 2 }}
											/>
										)}
									/>
								)}
							/>
						</Box>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 10 }} sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant="h6" component="h2" gutterBottom>Roles</Typography>

								<IconButton color="primary" onClick={handleAddRole}>
									<AddCircle />
								</IconButton>
							</Grid>
						</Grid>
						<Grid container spacing={2} sx={{ maxHeight: "500px", overflow: "auto" }}>
							<Grid size={{ xs: 10 }}>
								{
									watchRoles?.map((role, index) => (
										<Grid key={`role-${index}`} size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
											<TextField
												label="Code"
												{...register(`roles.${index}.code`)}
												error={!!errors.roles?.[index]?.code}
												helperText={errors.roles?.[index]?.code?.message}
												fullWidth
												size="small"
											/>
											<TextField
												label="Name"
												{...register(`roles.${index}.name`)}
												error={!!errors.roles?.[index]?.name}
												helperText={errors.roles?.[index]?.name?.message}
												fullWidth
												size="small"
											/>
											<TextField
												label="Description"
												{...register(`roles.${index}.description`)}
												error={!!errors.roles?.[index]?.description}
												helperText={errors.roles?.[index]?.description?.message}
												fullWidth
												rows={2}
												multiline
												size="small"
											/>
											<FormControl>
												<FormLabel>Access Type</FormLabel>
												<RadioGroup
													{...register(`roles.${index}.accessType`)}
													row
													value={role.accessType?.id}
													onChange={(e) => {
														const newAccessType = e.target.value;
														const newAccessTypeOption = accessTypeOptions.find((option) => option.id === newAccessType);
														if (newAccessTypeOption) {
															setValue(`roles.${index}.accessType`, newAccessTypeOption);
														}
													}}
												>
													{accessTypeOptions.map((option) => (
														<FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.label} />
													))}
												</RadioGroup>
												<FormHelperText>{errors.roles?.[index]?.accessType?.message}</FormHelperText>
											</FormControl>
											<Button
												color="error"
												onClick={() => handleRemoveRole(index)}
												sx={{ width: "fit-content", alignSelf: "flex-end" }}
												size="small"
												variant="outlined"
												startIcon={<Delete />}

											>
												Remove
											</Button>
										</Grid>
									))
								}
							</Grid>
						</Grid>
					</Grid>
					<Grid size={11} sx={{ display: "flex", justifyContent: "flex-end", mr: 2 }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ mt: 2 }}
						>
							Create App
						</Button>
					</Grid>
				</Grid>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Typography variant="h6" component="h2" gutterBottom>Applications</Typography>
				<DataGrid rows={rows} columns={columns} slots={{ toolbar: GridToolbar }} />
			</Box>
		</>
	);
}
