import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText, Chip, OutlinedInput, Autocomplete } from '@mui/material';
import { userSchema, UserFormData } from '../../schemas/userSchema';
import { IUser } from '../../types/search';
import { searchUsers } from '../../services/userService';

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
        defaultValues: initialData
            ? {
                ...initialData,
                id: { id: initialData.id, name: initialData.name },
            }
            : {
                id: { id: '', name: '' },
                email: '',
                roles: [],
                lastAccess: new Date().toISOString().split('T')[0],
                addedBy: 'SYSTEM',
                addedAt: new Date().toISOString().split('T')[0],
            },
    });

    const [userOptions, setUserOptions] = useState<IUser[]>([]);
    const [userSearchLoading, setUserSearchLoading] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                id: { id: initialData.id, name: initialData.name },
            });
            // If in edit mode, set options to initialData to help display if needed, though Autocomplete will be disabled.
            if (isEditMode && initialData) {
                setUserOptions([initialData]);
            }
        } else {
            reset({
                id: { id: '', name: '' },
                email: '',
                roles: [],
                lastAccess: new Date().toISOString().split('T')[0],
                addedBy: 'SYSTEM',
                addedAt: new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData, reset, isEditMode]);

    useEffect(() => {
        if (isEditMode) {
            // No searching needed if in edit mode as the field will be disabled
            return;
        }

        const handler = setTimeout(() => {
            setUserSearchLoading(true);
            searchUsers(userSearchQuery) // searchUsers handles empty query by returning all users.
                .then((users) => {
                    setUserOptions(users);
                })
                .catch(console.error) // Basic error handling
                .finally(() => {
                    setUserSearchLoading(false);
                });
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [userSearchQuery, isEditMode]);

    const handleFormSubmit = (data: UserFormData) => {
        onSubmit(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                freeSolo
                                disabled={isEditMode}
                                value={field.value}
                                onChange={(_event, newValue: string | IUser | { id: string; name: string; } | null) => {
                                    if (typeof newValue === 'string') {
                                        field.onChange({ id: newValue, name: newValue });
                                    } else if (newValue && 'email' in newValue) {
                                        field.onChange({ id: newValue.id, name: newValue.name });
                                        if (!isEditMode) {
                                            reset(prev => ({
                                                ...prev,
                                                id: { id: newValue.id, name: newValue.name },
                                                email: newValue.email,
                                                roles: newValue.roles,
                                            }));
                                        }
                                    } else if (newValue && typeof newValue === 'object' && 'id' in newValue && 'name' in newValue) {
                                        field.onChange(newValue);
                                    } else {
                                        field.onChange({ id: '', name: '' });
                                    }
                                }}
                                onInputChange={(_event, newInputValue, reason) => {
                                    if (reason === 'input' && !isEditMode) {
                                        setUserSearchQuery(newInputValue);
                                    }
                                }}
                                options={userOptions}
                                loading={userSearchLoading}
                                getOptionLabel={(option: string | IUser | { id: string; name: string; } | null) => {
                                    if (option === null || option === undefined) return '';
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    const id = option.id;
                                    const name = option.name;
                                    return name ? `${name} - ${id}` : id;
                                }}
                                filterOptions={(x) => x}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="User ID (Type or Search by Name/Email)"
                                        fullWidth
                                        required
                                        error={!!errors.id}
                                        helperText={errors.id?.message}
                                        size="small"
                                    />
                                )}
                            />
                        )}
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