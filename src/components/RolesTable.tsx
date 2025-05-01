import { DataGrid } from "@mui/x-data-grid";
import { roleSchema } from "../schemas/maintain_apps";
import { z } from "zod";

interface RolesTableProps {
	roles: z.input<typeof roleSchema>[];
}

const columns = [
	{ field: 'code', headerName: 'Code', width: 150 },
	{ field: 'name', headerName: 'Name', width: 150 },
	{ field: 'description', headerName: 'Description', width: 150 },
	{ field: 'accessType', headerName: 'Access Type', width: 150 },
	{ field: 'secureTo', headerName: 'Secure To', width: 150 },
];

const generateRows = (roles: z.input<typeof roleSchema>[]) => {
	return roles.map((role) => ({
		id: role.code,
		code: role.code,
		name: role.name,
		description: role.description,
		accessType: role.accessType.join(', '),
		secureTo: role.secureTo.join(', '),
	}));
};

export function RolesTable({ roles }: RolesTableProps) {
	const rows = generateRows(roles);
	return (
		<DataGrid
			rows={rows}
			columns={columns}
		/>
	);
}