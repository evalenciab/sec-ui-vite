import {
	Box,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { maintainAppsSchema } from "../../schemas/maintain_apps";
import { z } from "zod";
import { useApplicationStore } from "../../stores/application.store";
import { useEffect } from "react";
import { useRoleStore } from "../../stores/roles.store";
export function AppForm({
	form,
}: {
	form: UseFormReturn<z.input<typeof maintainAppsSchema>>;
}) {
	const {
		control,
		register,
		watch,
		reset,
		formState: { errors },
	} = form;
	const watchDeleteInactiveUsers = watch("deleteInactiveUsers");
	const {  selectedApplicationRowData } = useApplicationStore();
	
	useEffect(() => {
		if (selectedApplicationRowData) {
			console.log("Resetting form with default values");
			console.log(selectedApplicationRowData);	
			reset(selectedApplicationRowData);
			//setAllRoles(selectedApplicationRowData.roles);
		}
	}, [selectedApplicationRowData, reset]);
	return (
		<Grid container spacing={2}>
			<Grid
				size={5}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
				}}
			>
				<Typography variant="h5" component="h1" gutterBottom>
					Maintain App Settings
				</Typography>
				<TextField
					label="App ID"
					{...register("appId")}
					error={!!errors.appId}
					helperText={errors.appId?.message}
					required
					fullWidth
					size="small"
				/>
				<TextField
					label="App Name"
					{...register("appName")}
					error={!!errors.appName}
					fullWidth
					size="small"
				/>
				<TextField
					label="App Description"
					{...register("appDescription")}
					error={!!errors.appDescription}
					helperText={errors.appDescription?.message}
					multiline
					rows={3}
					fullWidth
					size="small"
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
										sx={{
											"&.Mui-checked": {
												color: "primary.main",
											},
										}}
										size="small"
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
						size="small"
					/>
				)}
			</Grid>
		</Grid>
	);
}
