import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
} from '@mui/material';
import { format } from 'date-fns';
import { filesize } from 'filesize';
import { Link } from 'react-router-dom';

import { TranscriptionHistory } from '../../../pages/Dashboard';
import CopyToClipboardButton from '../../CopyToClipboardButton';
import { Scrollbar } from '../scrollbar';

function formatTime(seconds: number): string {
  seconds = Math.round(seconds);
  let duration = '';

  if (seconds < 60) {
    duration = `${seconds} s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    duration = `${minutes} m`;
    if (remainingSeconds > 0) {
      duration += ` ${remainingSeconds} s`;
    }
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    duration = `${hours} h`;
    if (remainingMinutes > 0) {
      duration += ` ${remainingMinutes} m`;
    }
    if (remainingSeconds > 0) {
      duration += ` ${remainingSeconds} s`;
    }
  }

  return duration;
}

export default function DashboardTranscriptions({
  transcriptions = [],
  sx,
}: {
  transcriptions?: TranscriptionHistory[] | undefined;
  sx: SxProps<Theme>;
}) {
  return (
    <Card sx={sx}>
      <Button component={Link} to="/transcribehistory" variant="contained" size="large">
        View All Transcriptions
      </Button>
      <Button component={Link} to="/transcribe" variant="contained" size="large">
        Create Transcriptions
      </Button>
      <CardHeader title="Transcription History" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Copy</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Size</TableCell>
                <TableCell sortDirection="desc">Date</TableCell>
                <TableCell>Text</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transcriptions.map((transcript: TranscriptionHistory) => {
                const createdAt = format(new Date(transcript.created_at), 'dd/MM/yyyy');

                return (
                  <TableRow hover key={transcript.idempotency_key}>
                    <TableCell>
                      <CopyToClipboardButton text={transcript.transcription} />
                    </TableCell>
                    <TableCell>{formatTime(parseFloat(transcript.file_duration))}</TableCell>
                    <TableCell>
                      {filesize(parseFloat(transcript.file_size), { round: 0 }).toString()}
                    </TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{transcript.transcription}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
