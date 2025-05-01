import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
	Grid,
	TextField,
} from "@mui/material";
import { roleSchema } from "../schemas/maintain_apps";
import { z } from "zod";
import {
	Controller,
	useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Create } from "@mui/icons-material";

const accessTypes = [
	{ label: "Supplier", value: "Supplier" },
	{ label: "Employee", value: "Employee" },
	{ label: "Contingent", value: "Contingent" },
];

const secureTo = [
	{ label: "Employee", value: "Employee" },
	{ label: "Supplier", value: "Supplier" },
];
interface RolesFormProps {
	appendRole: (role: z.input<typeof roleSchema>) => void;
}
export function RolesForm({ appendRole }: RolesFormProps) {
	const roleForm = useForm<z.input<typeof roleSchema>>({
		resolver: zodResolver(roleSchema),
	});
	const {
		handleSubmit,
		control,
		register,
		formState: { errors, isValid },
		trigger,
		reset,
	} = roleForm;

	const onSubmit = () => {
		console.log("First validade the data");
		trigger();
		console.log("Then submit the data");
		if (isValid) {
			console.log("Data is valid, submit the data");
			appendRole(roleForm.getValues());
		} else {
			console.log("Data is invalid, show errors");
			console.log(errors);
		}
	};
	const resetForm = () => {
		reset();
	};
	return (
		<Box component="form" noValidate>
			<Grid container spacing={2}>
				<Grid
					size={12}
					sx={{ display: "flex", justifyContent: "flex-end" }}
				>
					<Button
						variant="outlined"
						startIcon={<Create />}
						onClick={resetForm}
					>
						Create Role
					</Button>
				</Grid>
				<Grid
					size={12}
					sx={{ display: "flex", flexDirection: "column", gap: 2 }}
				>
					<TextField
						label={"Code"}
						{...register("code")}
						error={!!errors.code}
						helperText={errors.code?.message}
						required
						fullWidth
						size="small"
					/>
					<TextField
						label={"Name"}
						{...register("name")}
						error={!!errors.name}
						helperText={errors.name?.message}
					/>
					<TextField
						label={"Description"}
						{...register("description")}
						error={!!errors.description}
						helperText={errors.description?.message}
					/>
					<FormLabel>Access Type</FormLabel>
					<FormGroup
						sx={{ display: "flex", flexDirection: "row", gap: 2 }}
					>
						{accessTypes.map((accessType) => (
							<Controller
								key={accessType.value}
								control={control}
								name="accessType"
								render={({ field }) => {
									const value = accessType.value as 'Supplier' | 'Employee' | 'Contingent';
									const currentValues = Array.isArray(field.value)
										? (field.value as Array<'Supplier' | 'Employee' | 'Contingent'>)
										: [];
									return (
										<FormControlLabel
											control={
												<Checkbox
													checked={currentValues.includes(value)}
													onChange={(e) => {
														if (e.target.checked) {
															field.onChange([...currentValues, value]);
														} else {
															field.onChange(currentValues.filter((v) => v !== value));
														}
													}}
												/>
											}
											label={accessType.label}
										/>
									);
								}}
							/>
						))}
					</FormGroup>
					<FormHelperText>
						{errors.accessType?.message }
					</FormHelperText>
					<FormLabel>Secure To</FormLabel>
					<FormGroup
						sx={{ display: "flex", flexDirection: "row", gap: 2 }}
					>
						{secureTo.map((secureTo) => (
							<Controller
								key={secureTo.value}
								control={control}
								name="secureTo"
								render={({ field }) => {
									const value = secureTo.value as 'Employee' | 'Supplier';
									const currentValues = Array.isArray(field.value)
										? (field.value as Array<'Employee' | 'Supplier'>)
										: [];
									return (
										<FormControlLabel
											control={
												<Checkbox
													checked={currentValues.includes(value)}
													onChange={(e) => {
														if (e.target.checked) {
															field.onChange([...currentValues, value]);
														} else {
															field.onChange(currentValues.filter((v) => v !== value));
														}
													}}
												/>
											}
											label={secureTo.label}
										/>
									);
								}}
							/>
						))}
					</FormGroup>
					<FormHelperText>
						{errors.secureTo?.message }
					</FormHelperText>
				</Grid>
				<Grid
					size={12}
					sx={{ display: "flex", justifyContent: "flex-end" }}
				>
					<Button
						variant="contained"
						color="primary"
						startIcon={<Add />}
						onClick={onSubmit}
					>
						Add Role
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
}
