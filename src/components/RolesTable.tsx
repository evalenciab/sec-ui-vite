import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { roleSchema } from "../schemas/maintain_apps";
import { z } from "zod";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { useRoleStore } from "../stores/roles.store";

type RoleInput = z.input<typeof roleSchema>;

interface RolesTableProps {
	roles: RoleInput[];
	editRole: (role: RoleInput) => void;
	deleteRole: (roleCode: string) => void;
}

interface RoleGridRow extends GridRowModel {
	id: string;
	code: string;
	name: string;
	description?: string;
	accessType: string;
	secureTo: string;
	originalRole: RoleInput;
}

const generateGridRows = (roles: RoleInput[]): RoleGridRow[] => {
	return roles.map((role) => ({
		id: role.code,
		code: role.code,
		name: role.name,
		description: role.description,
		accessType: role.accessType.join(', '),
		secureTo: role.secureTo.join(', '),
		originalRole: role,
	}));
};

export function RolesTable({ roles, editRole, deleteRole }: RolesTableProps) {
	const [open, setOpen] = useState(false);
	const [roleToDelete, setRoleToDelete] = useState<RoleInput | null>(null);
	
	const { setSelectedRoleRowData, allRoles } = useRoleStore();

	const handleOpenDeleteDialog = (role: RoleInput) => {
		setRoleToDelete(role);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setRoleToDelete(null);
	};

	const handleDeleteConfirm = () => {
		if (roleToDelete) {
			deleteRole(roleToDelete.code);
		}
		handleClose();
	};

	const columns: GridColDef<RoleGridRow>[] = [
		{
			field: 'actions', headerName: 'Actions', width: 120, sortable: false, filterable: false, disableColumnMenu: true,
			renderCell: (params) => {
				const originalRole = params.row.originalRole;
				return (
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
						<IconButton onClick={() => {
							setSelectedRoleRowData(originalRole);
							// editRole(originalRole);
						}} aria-label="edit">
							<EditIcon />
						</IconButton>
						<IconButton onClick={() => handleOpenDeleteDialog(originalRole)} aria-label="delete">
							<Delete />
						</IconButton>
					</Box>
				)
			}
		},
		{ field: 'code', headerName: 'Code', width: 150 },
		{ field: 'name', headerName: 'Name', width: 150 },
		{ field: 'description', headerName: 'Description', width: 200 },
		{ field: 'accessType', headerName: 'Access Type', width: 180 },
		{ field: 'secureTo', headerName: 'Secure To', width: 180 },
	];

	const gridRows = generateGridRows(allRoles);

	return (
		<>
			<DataGrid<RoleGridRow>
				rows={gridRows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 10 },
					},
				}}
				pageSizeOptions={[10, 25, 50]}
			/>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Delete Role Confirmation</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete the role "{roleToDelete?.name || roleToDelete?.code}"?
						This action cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleDeleteConfirm} color="error">Delete</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}