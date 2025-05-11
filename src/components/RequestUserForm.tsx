import {
	TextField,
	Box,
	Grid,
	Select,
	MenuItem,
	FormControl,
	FormLabel,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestUserSchema } from "../schemas/request.schema";
import { z } from "zod";

interface RequestUserFormProps {
	appId?: string | null;
	userId: string;
	openRequestAccessDialog: boolean;
	handleCloseRequestAccessDialog: () => void;
}
// This Form is used to request user access to an application
// It would require the following fields:
// - User ID
// - Application ID
// - Role
// - Reason
// - Status
// Would receive the following props:
// - Application ID
// - User ID (From the current user)
// - onSuccess: function to call when the form is submitted
// - onError: function to call when the form is submitted with an error
const allRoles = [
	{ code: "1", name: "Role 1" },
	{ code: "2", name: "Role 2" },
	{ code: "3", name: "Role 3" },
];
export function RequestUserForm({
	appId,
	userId,
	openRequestAccessDialog,
	handleCloseRequestAccessDialog,
}: RequestUserFormProps) {
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof requestUserSchema>>({
		resolver: zodResolver(requestUserSchema),
		defaultValues: {
			role: {
				code: "",
				name: "",
			},
			reason: "",
		},
	});
	const onSubmit = (data: any) => {
		console.log(data);
	};
	const handleRequestAccessConfirm = () => {
		console.log("Request Access");
		handleSubmit(onSubmit)();
	};
	return (
		<Dialog
			open={openRequestAccessDialog}
			onClose={handleCloseRequestAccessDialog}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>Request Access</DialogTitle>
			<DialogContent>
				<Box
					component="form"
					noValidate
				>
					<Grid container spacing={2}>
						<Grid
							size={12}
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 2,
							}}
						>
							<FormControl>
								<FormLabel>Role</FormLabel>
								<Controller
									control={control}
									name="role"
									render={({ field }) => (
										<Select
											{...field}
											size="small"
											value={field.value.code}
											onChange={(e) => {
												const value = e.target.value;
												const selectedRole = allRoles.find((role) => role.code === value);
												field.onChange(selectedRole);
												
											}}
											error={!!errors.role}
										>
											{allRoles.map((role) => (
												<MenuItem
													key={role.code}
													value={role.code}
												>
													{role.name}
												</MenuItem>
											))}
										</Select>
									)}
								/>
								<FormHelperText error={!!errors.role}>{errors.role?.message}</FormHelperText>
							</FormControl>
							<TextField
								{...register("reason")}
								label="Reason"
								placeholder="Enter your reason for requesting access to this application"
								error={!!errors.reason}
								helperText={errors.reason?.message}
								multiline
								rows={4}
								size="small"
							/>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseRequestAccessDialog}>Cancel</Button>
				<Button onClick={handleRequestAccessConfirm}>
					Request Access
				</Button>
			</DialogActions>
		</Dialog>
	);
}
