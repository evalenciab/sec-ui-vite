import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
	MaintainAppsFormData,
	maintainAppsSchema,
} from "../schemas/maintain_apps";
import { z } from "zod";
import { IUserOption } from "../types/search";
import { Autocomplete } from "@mui/material";
const userOptions: IUserOption[] = [
	{ id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' },
	{ id: 'JDOE', label: 'John Doe (JDOE)' },
	{ id: 'ASMITH', label: 'Alice Smith (ASMITH)' },
];

export function MaintainApps() {
	const {
		control,
		handleSubmit,
		register,
		watch,
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
					<Grid size={{ xs: 12, md: 6 }}>
						<Typography variant="h6" component="h2" gutterBottom>Roles</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<Button variant="contained" color="primary">Add Role</Button>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6 }}>
						{
							watchRoles?.map((role) => (
								<Grid key={role.code} size={{ xs: 12, md: 6 }}>
									<Typography variant="h6" component="h3" gutterBottom>{role.name}</Typography>
									<Typography variant="body1" component="p" gutterBottom>{role.description}</Typography>
									
								</Grid>
							))
						}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
