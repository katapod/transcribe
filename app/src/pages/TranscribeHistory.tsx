import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Container,
  Fade,
  Modal,
  Typography,
} from '@mui/material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../components/authentication/AuthProvider';
import PrettyTable from '../components/PrettyTable';

export default function TranscribeHistory() {
  const { supabase } = useAuth();
  const VISIBLE_FIELDS = ['created_at', 'file_duration', 'transcription'];

  const [data, setData] = useState<{ columns: GridColDef[]; rows: GridRowsProp }>({
    columns: [],
    rows: [],
  });

  const [binData, setBinData] = useState<{ columns: GridColDef[]; rows: GridRowsProp }>({
    columns: [],
    rows: [],
  });

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

  const getTranscriptions = useCallback(
    async (table: 'transcriptions' | 'transcriptions_bin') => {
      if (!supabase) return;
      const { data, error } = await supabase.client
        .from(table ?? 'transcriptions')
        .select('id,created_at,transcription,file_size,file_duration,file_type');

      if (error) {
        console.warn(error);
        return;
      }

      const columns: Array<GridColDef> = [
        { field: 'id', headerName: 'ID', width: 70, editable: false },
        {
          field: 'created_at',
          headerName: 'Created At',
          width: 130,
          editable: false,
          // TODO: determine type of params
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          renderCell: (params: any) => (
            <Box
              sx={{
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
              }}
            >
              {new Date(params.value as string).toLocaleString()}
            </Box>
          ),
        },
        { field: 'file_size', headerName: 'File Size', width: 130, editable: false },
        { field: 'file_duration', headerName: 'Duration', width: 70, editable: false },
        { field: 'file_type', headerName: 'File Type', width: 130, editable: false },
        {
          field: 'transcription',
          headerName: 'Transcription',
          flex: 1,
          editable: true,
          // TODO: determine type of params
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          renderCell: (params: any) => (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {params.value}
            </Typography>
          ),
        },
      ];

      const rows: GridRowsProp = data.map((row) => ({
        id: row.id,
        created_at: new Date(row.created_at),
        file_size: row.file_size,
        file_duration: formatTime(row.file_duration),
        file_type: row.file_type,
        transcription: row.transcription,
      }));

      return { columns, rows };
    },
    [supabase]
  );

  useEffect(() => {
    getTranscriptions('transcriptions').then((data) => {
      if (data) {
        setData(data);
      }
    });
  }, [getTranscriptions]);

  const [openBin, setOpenBin] = useState(false);
  const handleOpenBin = () => {
    setOpenBin(true);
    getTranscriptions('transcriptions_bin').then((data) => {
      if (data) {
        setBinData(data);
      }
    });
  };
  const handleCloseBin = () => setOpenBin(false);

  return (
    <Container>
      <ButtonGroup>
        <Button onClick={handleOpenBin}>Open Bin</Button>
      </ButtonGroup>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openBin}
        onClose={handleCloseBin}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openBin}>
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              bgcolor: 'background.paper',
              borderRadius: 5,
              boxShadow: 24,
              p: 4,
            }}
          >
            {binData && (
              <PrettyTable data={binData} visibleColumns={VISIBLE_FIELDS} permanentDelete />
            )}
          </Box>
        </Fade>
      </Modal>
      {data && <PrettyTable data={data} visibleColumns={VISIBLE_FIELDS} />}
    </Container>
  );
}
