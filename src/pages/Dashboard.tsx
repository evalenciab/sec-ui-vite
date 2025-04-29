import { Grid, Typography, Card, CardContent, SvgIcon, CardActionArea } from "@mui/material";
import { Box } from "@mui/material";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PeopleIcon from '@mui/icons-material/People';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AppsIcon from '@mui/icons-material/Apps';

interface StatCardProps {
    icon: typeof SvgIcon;
    label: string;
    value: string | number;
}

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => {
    return (
        <Card sx={{cursor: 'pointer'}}>
            <CardActionArea 
                sx={{
                    height: '100%',
                    '&[data-active]': {
                      backgroundColor: 'action.selected',
                      '&:hover': {
                        backgroundColor: 'action.selectedHover',
                      },
                    },
                  }}
            >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Icon sx={{ mr: 1 }} />
                        <Typography variant="h6">{label}</Typography>
                    </Box>
                    <Typography variant="h4">{value}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

const generalStats = [
    { icon: PendingActionsIcon, label: "Pending Requests", value: 30 },
    { icon: PeopleIcon, label: "Users to Certified", value: "500 Users" },
    { icon: NoAccountsIcon, label: "Inactive Users", value: "45 Users" },
    { icon: PersonOffIcon, label: "Users lost access", value: "10 Users" },
];

const appStats = [
    { icon: AppsIcon, label: "Awesome App", value: "123 Users" },
    { icon: AppsIcon, label: "Supper Awesome App", value: "500 Users" },
    { icon: AppsIcon, label: "Ultra Super Awesome App", value: "800 Users" }, // Assuming the last one was App 3
];

export const Dashboard = () => {
    return (
        <Grid container spacing={3}>
            {generalStats.map((stat, index) => (
                <Grid size={{xs: 12, sm: 6, md: 3}}  key={index}>
                    <StatCard icon={stat.icon} label={stat.label} value={stat.value} />
                </Grid>
            ))}

            <Grid size={{xs: 12}}>
                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                    My Applications
                </Typography>
            </Grid>

            {appStats.map((stat, index) => (
                <Grid size={{xs: 12, sm: 6, md: 4}} key={`app-${index}`}>
                    <StatCard icon={stat.icon} label={stat.label} value={stat.value} />
                </Grid>
            ))}
        </Grid>
    );
};
