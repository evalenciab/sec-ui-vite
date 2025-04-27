import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
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
import { AddCircle, Delete } from "@mui/icons-material";
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
		},
	});

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
		<Grid container spacing={2}>
			<Grid size={{ xs: 12, md: 6 }}>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

						<Grid container justifyContent="flex-end">
							<Button
								type="submit"
								variant="contained"
								color="primary"
								sx={{ mt: 2 }}
							>
								Create App
							</Button>
						</Grid>
					</Box>
				</Box>
			</Grid>
			<Grid size={{ xs: 12, md: 6 }}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 10 }} sx={{display: "flex", justifyContent: "space-between"}}>
						<Typography variant="h6" component="h2" gutterBottom>Roles</Typography>
						
						<IconButton color="primary" onClick={handleAddRole}>
							<AddCircle />
						</IconButton>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{maxHeight: "500px", overflow: "auto"}}>
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
									</FormControl>
									<Button 
										color="error" 
										onClick={() => handleRemoveRole(index)} 
										sx={{width: "fit-content", alignSelf: "flex-end"}} 
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
		</Grid>
	);
}
