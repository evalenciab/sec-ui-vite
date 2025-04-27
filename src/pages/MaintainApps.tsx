import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
	MaintainAppsFormData,
	maintainAppsSchema,
} from "../schemas/maintain_apps";
import { z } from "zod";

export function MaintainApps() {
	const {
		control,
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm<z.input<typeof maintainAppsSchema>>({
		resolver: zodResolver(maintainAppsSchema),
	});

	const watchDeleteInactiveUsers = watch("deleteInactiveUsers");

	const onSubmit = (data: z.input<typeof maintainAppsSchema>) => {
		console.log(data);
		// Handle form submission logic here (e.g., API call)
	};

	return (
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
				/>
				<TextField
					label="App Description"
					{...register("appDescription")}
					error={!!errors.appDescription}
					helperText={errors.appDescription?.message}
					multiline
					rows={3}
					fullWidth
				/>
				<FormGroup>
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
						InputProps={{ inputProps: { min: 1 } }}
					/>
				)}
				<Button type="submit" variant="contained" color="primary">
					Save Settings
				</Button>
			</Box>
		</Box>
	);
}
