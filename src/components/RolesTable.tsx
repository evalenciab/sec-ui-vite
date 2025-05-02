import { DataGrid } from "@mui/x-data-grid";
import { roleSchema } from "../schemas/maintain_apps";
import { z } from "zod";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

interface RolesTableProps {
	roles: z.input<typeof roleSchema>[];
	editRole: (role: z.input<typeof roleSchema>) => void;
}

const columns = [
	{ field: 'actions', headerName: 'Actions', width: 100, renderCell: (params: any) => {
		return (
			<IconButton onClick={() => {
				console.log("Editing role", params.row);
				console.log(params)
				const role = {
					...params.row,
					accessType: params.row.accessType.split(','),
					secureTo: params.row.secureTo.split(','),
				}
				params.row.actions(role);
			}}>
				<EditIcon />
			</IconButton>
		)
	}},
	{ field: 'code', headerName: 'Code', width: 150 },
	{ field: 'name', headerName: 'Name', width: 150 },
	{ field: 'description', headerName: 'Description', width: 150 },
	{ field: 'accessType', headerName: 'Access Type', width: 150 },
	{ field: 'secureTo', headerName: 'Secure To', width: 150 },
];

const generateRows = (roles: z.input<typeof roleSchema>[], editRole: (role: z.input<typeof roleSchema>) => void) => {
	return roles.map((role) => ({
		id: role.code,
		code: role.code,
		name: role.name,
		description: role.description,
		accessType: role.accessType.join(', '),
		secureTo: role.secureTo.join(', '),
		actions: editRole,
	}));
};

export function RolesTable({ roles, editRole }: RolesTableProps) {
	const rows = generateRows(roles, editRole);
	return (
		<DataGrid
			rows={rows}
			columns={columns}
			initialState={{
				pagination: {
					paginationModel: { page: 0, pageSize: 10 },
				},
			}}
			pageSizeOptions={[10, 25, 50]}
		/>
	);
}