import { Grid, IconButton, Box, Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import { IUser } from "../../types/search";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { mockUsers } from "../../data/mock-users";
import { Delete } from "@mui/icons-material";
import { useState } from "react";

interface IAppUsersGridProps {
    users?: IUser[];
    onDeleteUser?: (userId: string) => void;
}

interface IUserGridRow extends Omit<IUser, 'roles'> {
    roles: string;
    originalUser: IUser;
}

export const AppUsersGrid = ({ users = mockUsers, onDeleteUser }: IAppUsersGridProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

    const handleOpenDeleteDialog = (user: IUser) => {
        setUserToDelete(user);
        setIsDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setUserToDelete(null);
        setIsDialogOpen(false);
    };

    const handleConfirmDelete = () => {
        if (userToDelete && onDeleteUser) {
            onDeleteUser(userToDelete.id);
        }
        handleCloseDeleteDialog();
    };

    const columns: GridColDef<IUserGridRow>[] = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "roles", headerName: "Roles", flex: 1 },
        { field: "lastAccess", headerName: "Last Access", flex: 1 },
        { field: "addedBy", headerName: "Added By", flex: 1 },
        { field: "addedAt", headerName: "Added At", flex: 1 },
        {
            field: "actions", width: 80, headerName: "", sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <Box display="flex" justifyContent="flex-end" sx={{ width: '100%' }}>
                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(params.row.originalUser)} aria-label="delete">
                            <Delete />
                        </IconButton>
                    </Box>
                )
            }
        },
    ];

    const generateRows = (usersToMap: IUser[]): IUserGridRow[] => {
        return usersToMap.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles.join(", "),
            lastAccess: user.lastAccess,
            addedBy: user.addedBy,
            addedAt: user.addedAt,
            originalUser: user
        }));
    };

    const rows = generateRows(users);

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        density="compact"
                    />
                </Grid>
            </Grid>
            <Dialog open={isDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user "{userToDelete?.name || userToDelete?.id}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

