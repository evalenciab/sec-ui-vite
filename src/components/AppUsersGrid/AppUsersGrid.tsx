import { Grid, IconButton, Box } from "@mui/material";
import { IUser } from "../../types/search";
import { DataGrid } from "@mui/x-data-grid";
import { mockUsers } from "../../data/mock-users";
import { Delete, MoreVert } from "@mui/icons-material";
interface IAppUsersGridProps {
    users: IUser[];
}
const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "roles", headerName: "Roles", flex: 1 },
    { field: "lastAccess", headerName: "Last Access", flex: 1 },
    { field: "addedBy", headerName: "Added By", flex: 1 },
    { field: "addedAt", headerName: "Added At", flex: 1 },
    {
        field: "actions", width: 80, headerName: "", renderCell: (params: any) => {
            return (
                <Box display="flex" justifyContent="flex-end">
                    <IconButton size="small" color="error" onClick={() => {
                        console.log(params.row.originalUser);
                    }}>
                        <Delete />
                    </IconButton>
                </Box>
            )
        }
    },
]


export const AppUsersGrid = ({ users = mockUsers }: IAppUsersGridProps) => {
    const generateRows = (users: IUser[]) => {
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles.join(", "),
            lastAccess: user.lastAccess,
            addedBy: user.addedBy,
            addedAt: user.addedAt,
            originalUser: user
        }))
    }
    const rows = generateRows(users);
    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    density="compact"

                />
            </Grid>
        </Grid>
    )
}

