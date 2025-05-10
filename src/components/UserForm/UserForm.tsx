import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText, Chip, OutlinedInput } from '@mui/material';
import { userSchema, UserFormData } from '../../schemas/userSchema';
import { IUser } from '../../types/search';

// Mock data for roles, replace with actual data source if needed
const availableRoles = [
    "Admin",
    "User",
    "Business Owner",
    "Auditor",
    "Contributor",
];

interface UserFormProps {
    initialData?: IUser | null;
    onSubmit: (data: UserFormData) => void;
    onClose: () => void;
    isEditMode?: boolean;
}

export function UserForm({ initialData, onSubmit, onClose, isEditMode = false }: UserFormProps) {
    const {
        control,
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: initialData || {
            id: '',
            name: '',
            email: '',
            roles: [],
            lastAccess: new Date().toISOString().split('T')[0], // Default to today for simplicity
            addedBy: 'SYSTEM', // Default, should be dynamic in a real app
            addedAt: new Date().toISOString().split('T')[0], // Default to today
        },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                id: '',
                name: '',
                email: '',
                roles: [],
                lastAccess: new Date().toISOString().split('T')[0],
                addedBy: 'SYSTEM', 
                addedAt: new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: UserFormData) => {
        onSubmit(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        {...register('id')}
                        label="User ID"
                        fullWidth
                        required
                        error={!!errors.id}
                        helperText={errors.id?.message}
                        disabled={isEditMode} // Disable ID field in edit mode
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        {...register('name')}
                        label="Name"
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        {...register('email')}
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth error={!!errors.roles} size="small">
                        <InputLabel id="roles-select-label">Roles</InputLabel>
                        <Controller
                            name="roles"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="roles-select-label"
                                    multiple
                                    input={<OutlinedInput label="Roles" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected as string[]).map((value) => (
                                                <Chip key={value} label={value} size="small"/>
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {availableRoles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.roles && <FormHelperText>{errors.roles.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        {...register('lastAccess')}
                        label="Last Access (YYYY-MM-DD)"
                        fullWidth
                        // In a real app, this might be a DatePicker or read-only
                        error={!!errors.lastAccess}
                        helperText={errors.lastAccess?.message}
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        {...register('addedBy')}
                        label="Added By"
                        fullWidth
                        // In a real app, this might be pre-filled or read-only
                        error={!!errors.addedBy}
                        helperText={errors.addedBy?.message}
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        {...register('addedAt')}
                        label="Added At (YYYY-MM-DD)"
                        fullWidth
                        // In a real app, this might be a DatePicker or read-only
                        error={!!errors.addedAt}
                        helperText={errors.addedAt?.message}
                        size="small"
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                <Button onClick={onClose} color="inherit" disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add User')}
                </Button>
            </Box>
        </Box>
    );
} 