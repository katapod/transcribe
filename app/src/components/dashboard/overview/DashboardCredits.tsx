import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';

export default function DashboardCredits({
  value,
  max,
  sx,
}: {
  value: number;
  max: number;
  sx: SxProps<Theme>;
}) {
  const normalise = (val: number) => ((val - 0) * 100) / (max - 0);
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" gutterBottom variant="overline">
              Credited Minutes
            </Typography>
            <Typography variant="h6">
              {Math.ceil(value / 60)}/{Math.ceil(max / 60)} m
            </Typography>
            {max > 0 && <Typography variant="h6">{Math.floor(normalise(value))}%</Typography>}
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <ListBulletIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LinearProgress value={normalise(value)} variant="determinate" />
        </Box>
      </CardContent>
    </Card>
  );
}
