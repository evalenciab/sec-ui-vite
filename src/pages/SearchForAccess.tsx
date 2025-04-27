import { Box, Typography } from "@mui/material"
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

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

export const SearchForAccess = () => {
    return (
        <Box>
            <Typography variant="body1">Filters</Typography>
            <Box>

            </Box>
            <Typography variant="body1">Results</Typography>
            <DataGrid rows={rows} columns={columns} />
        </Box>
    )
}

