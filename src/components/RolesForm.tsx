import {
	Box,
	Button,
	Checkbox,
	Chip,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
	Grid,
	MenuItem,
	Select,
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
		formState: { errors, isValid },
		trigger,
		reset,


	} = roleForm;

	useEffect(() => {
		if (selectedRoleRowData) {
			console.log("Resetting form with tempRole", selectedRoleRowData);
			reset(selectedRoleRowData);
		} else {
			console.log("Resetting form with default values");
			reset({
				code: '',
				name: '',
				description: '',
				accessType: [],
				secureTo: []

			});
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
						size="small"
					/>
					<TextField
						label={"Description"}
						{...register("description")}
						error={!!errors.description}
						helperText={errors.description?.message}
						size="small"
					/>
					<FormControl>
						<FormLabel>Access Type</FormLabel>
						<Controller
							control={control}
							name="accessType"
							render={({ field }) => {
								return (
									<Select
										{...field}
										multiple
										size="small"
										value={field.value}
										renderValue={(selected) => (
											<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
												{selected.map((value) => (
													<Chip key={value} label={value} size="small" />
												))}
											</Box>
										)}
										onChange={(e) => field.onChange(e.target.value)}
									>
										{accessTypes.map((accessType) => (
											<MenuItem key={accessType.value} value={accessType.value}>
												{accessType.label}
											</MenuItem>
										))}
									</Select>
								);
							}}
						/>
					</FormControl>
					{errors.accessType && (
						<FormHelperText>
							{errors.accessType?.message}
						</FormHelperText>
					)}
					<FormControl>
						<FormLabel>Secure To</FormLabel>
						<Controller
							control={control}
							name="secureTo"
							render={({ field }) => {
								return (
									<Select {...field} multiple size="small" value={field.value} onChange={(e) => field.onChange(e.target.value)}>
										{secureTo.map((secureTo) => (
											<MenuItem key={secureTo.value} value={secureTo.value}>
												{secureTo.label}
											</MenuItem>
										))}
									</Select>
								);
							}}
						/>
					</FormControl>
					<FormHelperText>
						{errors.secureTo?.message}
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
