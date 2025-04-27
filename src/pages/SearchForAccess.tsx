import { Box, Typography, TextField, Autocomplete, Select, MenuItem, FormControl, InputLabel, Button, Grid } from "@mui/material"
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { ISearchFormInput, IUserOption, IApplicationOption, IAccessTypeOption } from "../types/search";

const rows: GridRowsProp = [
    { id: 1, appName: 'Awesome App', userId: 'EVALENCIA', userName: 'Valencia, Elias', email: 'elias@valencia.com', accessType: 'Admin' },
    { id: 2, appName: 'Awesome App 2', userId: 'EVALENCIA', userName: 'Valencia, Elias', email: 'elias@valencia.com', accessType: 'Gerenal' },
    { id: 3, appName: 'Awesome App 3', userId: 'EVALENCIA', userName: 'Valencia, Elias', email: 'elias@valencia.com', accessType: 'Business Owner' },
    { id: 4, appName: 'Awesome App 4', userId: 'EVALENCIA', userName: 'Valencia, Elias', email: 'elias@valencia.com', accessType: 'Admin' },
    { id: 5, appName: 'Awesome App 5', userId: 'EVALENCIA', userName: 'Valencia, Elias', email: 'elias@valencia.com', accessType: 'Admin' },
];

const columns: GridColDef[] = [
    { field: 'appName', headerName: 'Application', width: 200 },
    { field: 'accessType', headerName: 'Access Type', width: 300 },
    { field: 'userId', headerName: 'User ID', width: 100 },
    { field: 'userName', headerName: 'User Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },


];

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

export const SearchForAccess = () => {
    const { handleSubmit, control, formState: { errors } } = useForm<ISearchFormInput>({
        defaultValues: {
            user: null,
            application: '',
            accessType: '',
        }
    });

    const onSubmit: SubmitHandler<ISearchFormInput> = (data) => {
        console.log(data);
        // TODO: Implement search logic based on form data
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2, borderRadius: 1 }}
            >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
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

                    <Grid size={{ xs: 12, md: 6 }}>
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

                    <Grid size={{ xs: 12, md: 6 }}>
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


                    <Grid size={12} display="flex" justifyContent="flex-end" gap={2}>
                        {/* TODO: Use all space available */}
                        <Button type="submit" variant="contained"  >Search</Button>
                        <Button type="reset" variant="outlined" >Reset</Button>
                    </Grid>
                </Grid>
            </Box>
            <Typography variant="h6">Results</Typography>
            <DataGrid rows={rows} columns={columns} autoHeight /> {/* Added autoHeight for better layout */}
        </Box>
    )
}

