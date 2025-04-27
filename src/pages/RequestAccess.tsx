import { Autocomplete, Box, TextField, Grid, Typography, MenuItem, Select, InputLabel, FormControl, Stack, Button } from "@mui/material";
import { IApplicationOption, IAccessTypeOption, ISearchFormInput, IUserOption, IRequestAccessFormInput } from "../types/search";
import { Controller, useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
// Mock data for Autocomplete/Select options - replace with actual data fetching later
const userOptions: IUserOption[] = [
    { id: 'EVALENCIA', label: 'Elias Valencia (EVALENCIA)' },
    { id: 'JDOE', label: 'John Doe (JDOE)' },
    { id: 'ASMITH', label: 'Alice Smith (ASMITH)' },
];

const applicationOptions: IApplicationOption[] = [
    { id: 'app1', label: 'Awesome App' },
    { id: 'app2', label: 'Awesome App 2' },
    { id: 'app3', label: 'Awesome App 3' },
    { id: 'app4', label: 'Awesome App 4' },
    { id: 'app5', label: 'Awesome App 5' },
];
const accessTypeOptions: IAccessTypeOption[] = [
    { id: 'ADMIN', label: 'Admin' },
    { id: 'GENERAL', label: 'General' },
    { id: 'BUSINESS_OWNER', label: 'Business Owner' },
];

export const RequestAccess = () => {
    const { handleSubmit, control, formState: { errors } } = useForm<IRequestAccessFormInput>({
        defaultValues: {
            user: null,
            application: '',
            accessType: '',
			comment: '',
        }
    });

    const onSubmit: SubmitHandler<IRequestAccessFormInput> = (data) => {
        console.log(data);
        // TODO: Implement search logic based on form data
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Request Access</Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid grey', padding: 2, borderRadius: 1 }}
            >
                <Stack direction="column" spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 10, md: 4 }}>
                            <Controller
                                name="user"
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
                                                label="User (ID or Name)"
                                                variant="outlined"
                                                error={!!errors.user}
                                                helperText={errors.user?.message}
                                                size="small"
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 4 }}>
							<Controller
								name="application"
								control={control}
								render={({ field }) => (
									<FormControl fullWidth error={!!errors.application}>
										<InputLabel id="application-select-label">Application</InputLabel>
										<Select
											{...field}
											labelId="application-select-label"
											label="Application"
											size="small"
										// Consider using Autocomplete here if the list is very long and needs search
										>
											<MenuItem value=""><em>None</em></MenuItem>
											{applicationOptions.map((app) => (
												<MenuItem key={app.id} value={app.id}>{app.label}</MenuItem>
											))}
										</Select>
										{errors.application && <Typography variant="caption" color="error">{errors.application.message}</Typography>}
									</FormControl>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 4 }}>
							<Controller
								name="accessType"
								control={control}
								render={({ field }) => (
									<FormControl fullWidth error={!!errors.accessType}>
										<InputLabel id="access-type-select-label">Access Type</InputLabel>
										<Select
											{...field}
											labelId="access-type-select-label"
											label="Access Type"
											size="small"
										>
											<MenuItem value=""><em>None</em></MenuItem>
											{accessTypeOptions.map((type) => (
												<MenuItem key={type.id} value={type.id}>{type.label }</MenuItem>
											))}
										</Select>
										{errors.accessType && <Typography variant="caption" color="error">{errors.accessType.message}</Typography>}
									</FormControl>
								)}
							/>
						</Grid>
                    </Grid>
                </Stack>
				<Grid container spacing={2}>
					<Grid size={{ xs: 8}}>
						<Controller
							name="comment"
							control={control}
							render={({ field }) => <TextField {...field} label="Comment" multiline rows={4}  fullWidth/>}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid size={{ xs: 8}} display="flex" justifyContent="flex-end">
						<Button type="submit" variant="contained">Request Access</Button>
					</Grid>
				</Grid>
            </Box>
        </Box>
    )
}
