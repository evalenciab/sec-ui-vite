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
import { Add, Clear, Create } from "@mui/icons-material";
import { useEffect } from "react";
import { useRoleStore } from "../stores/roles.store";
import { enqueueSnackbar } from "notistack";
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
	const { setSelectedRoleRowData, selectedRoleRowData, setAllRoles, allRoles } = useRoleStore();
	
	const roleForm = useForm<z.input<typeof roleSchema>>({
		resolver: zodResolver(roleSchema),
		defaultValues: {
			code: '',
			name: '',
			description: '',
			accessType: [],
			secureTo: [],
		}
	});
	const {
		handleSubmit,
		control,
		register,
		formState: { errors, isValid},
		trigger,
		reset,
		
		
	} = roleForm;

	useEffect(() => {
		if (selectedRoleRowData) {
			console.log("Resetting form with tempRole", selectedRoleRowData);
			reset(selectedRoleRowData);
		} else {
			reset();
		}
	}, [selectedRoleRowData, reset]);

	const onSubmit = () => {
		console.log("First validade the data");
		trigger();
		console.log("Then submit the data");
		if (isValid) {
			console.log("Data is valid, submit the data");
			if (selectedRoleRowData) {
				//editRole(roleForm.getValues());
				console.log("Edit role", roleForm.getValues());
				setAllRoles(allRoles.map(role => role.code === selectedRoleRowData.code ? roleForm.getValues() : role));
			} else {
				// check if the role already exists
				if (allRoles.some(role => role.code === roleForm.getValues().code)) {
					console.log("Role already exists, show error");
					//toast.error("Role already exists");
					enqueueSnackbar("Role already exists", { variant: "error" });
				} else {
					appendRole(roleForm.getValues());
					setAllRoles([...allRoles, roleForm.getValues()]);
					reset();
					setSelectedRoleRowData(null);
				}
			}
			//appendRole(roleForm.getValues());
			//reset();
		} else {
			console.log("Data is invalid, show errors");
			console.log(errors);
		}
	};
	const resetForm = () => {
		console.log("Resetting form with default values");
		setSelectedRoleRowData(null);
		
		reset({
			code: '',
			name: '',
			description: '',
			accessType: [],
			secureTo: [],
		});
	};
	return (
		<Box component="form" noValidate>
			<Grid container spacing={2}>
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
					sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
				>
					<Button
						variant="outlined"
						startIcon={<Clear />}
						onClick={resetForm}
					>
						Clear
					</Button>
					<Button
						variant="contained"
						color="primary"
						startIcon={<Add />}
						onClick={onSubmit}
					>
						{selectedRoleRowData ? "Update Role" : "Add Role"}
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
}
