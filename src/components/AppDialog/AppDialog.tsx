import { Button, DialogActions, Dialog, DialogContent, DialogTitle } from "@mui/material";

export const AppDialog = ({
	title,
	open,
	onClose,
    onSave,
	children,
}: {
	title: string;
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	children: React.ReactNode;
}) => {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" >
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onSave}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};
