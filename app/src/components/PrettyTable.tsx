import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RestoreIcon from '@mui/icons-material/Restore';
import { Box, Snackbar } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditStopParams,
  GridCellEditStopReasons,
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridToolbar,
  MuiEvent,
} from '@mui/x-data-grid';
import log from 'loglevel';
import * as React from 'react';

import { useAuth } from './authentication/AuthProvider';

export default function PrettyTable({
  data,
  visibleColumns,
  permanentDelete,
}: {
  data: { columns: GridColDef[]; rows: GridRowsProp };
  visibleColumns: string[];
  permanentDelete?: boolean;
}) {
  type Row = (typeof data.rows)[number];

  /* const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  }); */

  // Otherwise filter will be applied on fields such as the hidden column id

  const [rows, setRows] = React.useState<Array<Row>>(data.rows as Array<Row>);
  const [copySnackbarOpen, setCopySnackbarOpen] = React.useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = React.useState(false);
  const [deletePermSnackbarOpen, setDeletePermSnackbarOpen] = React.useState(false);
  const [restoreSnackbarOpen, setRestoreSnackbarOpen] = React.useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = React.useState(
    'An Unknown Error Occurred'
  );

  const { supabase } = useAuth();

  const deleteRow = React.useCallback(
    (id: GridRowId) => async () => {
      if (!supabase) return;
      if (permanentDelete) {
        const { error } = await supabase.client.from('transcriptions_bin').delete().eq('id', id);

        if (error) {
          setErrorSnackbarMessage('An Error Occurred While Deleting The Row');
          setErrorSnackbarOpen(true);
        } else {
          setRows((prevRows) => prevRows.filter((row) => row.id !== id));
          setDeletePermSnackbarOpen(true);
        }
      } else {
        const { data, error: selectError } = await supabase.client
          .from('transcriptions')
          .select('*')
          .eq('id', id)
          .limit(1)
          .maybeSingle();

        if (selectError) {
          setErrorSnackbarMessage('An Error Occurred While Deleting The Row');
          setErrorSnackbarOpen(true);
          return;
        }
        const { error: insertError } = await supabase.client
          .from('transcriptions_bin')
          .insert(data);
        if (insertError) {
          setErrorSnackbarMessage('An Error Occurred While Deleting The Row');
          setErrorSnackbarOpen(true);
          return;
        }
        const { error: deleteError } = await supabase.client
          .from('transcriptions')
          .delete()
          .eq('id', id);
        if (deleteError) {
          setErrorSnackbarMessage('An Error Occurred While Deleting The Row');
          setErrorSnackbarOpen(true);
          return;
        }

        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        setDeleteSnackbarOpen(true);
      }
    },
    [permanentDelete, supabase]
  );

  const restoreRow = React.useCallback(
    (id: GridRowId) => async () => {
      if (!supabase) return;
      const { data, error: selectError } = await supabase.client
        .from('transcriptions_bin')
        .select('*')
        .eq('id', id)
        .limit(1)
        .maybeSingle();

      if (selectError) {
        setErrorSnackbarMessage('An Error Occurred While Restoring The Row');
        setErrorSnackbarOpen(true);
        return;
      }
      const { error: insertError } = await supabase.client.from('transcriptions').insert(data);
      if (insertError) {
        setErrorSnackbarMessage('An Error Occurred While Restoring The Row');
        setErrorSnackbarOpen(true);
        return;
      }
      const { error: deleteError } = await supabase.client
        .from('transcriptions_bin')
        .delete()
        .eq('id', id);
      if (deleteError) {
        setErrorSnackbarMessage('An Error Occurred While Restoring The Row');
        setErrorSnackbarOpen(true);
        return;
      }

      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setRestoreSnackbarOpen(true);
    },
    [supabase]
  );

  const duplicateRow = React.useCallback(
    (id: GridRowId) => () => {
      setRows((prevRows) => {
        const rowToDuplicate = prevRows.find((row) => row.id === id);
        if (!rowToDuplicate) {
          log.error("Row doesn't exist");
          return prevRows;
        }
        return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      });
    },
    []
  );

  const copyTranscription = React.useCallback(
    (id: GridRowId) => () => {
      const rowToCopy = rows.find((row) => row.id === id);
      if (!rowToCopy) return log.error("Row doesn't exist");
      const text = rowToCopy.transcription;
      navigator.clipboard.writeText(text);
      setCopySnackbarOpen(true);
    },
    [rows]
  );

  const columns: GridColDef[] = React.useMemo(() => {
    return data.columns
      .filter((column) => visibleColumns.includes(column.field))
      .concat([
        {
          field: 'actions',
          type: 'actions',
          width: 80,
          getActions: (params) => [
            <GridActionsCellItem
              key={'Copy Button'}
              icon={<ContentCopyIcon />}
              label="Copy Transcription"
              onClick={copyTranscription(params.id)}
              showInMenu
            />,
            <GridActionsCellItem
              key={'Duplicate Button'}
              icon={<FileCopyIcon />}
              label="Duplicate"
              onClick={duplicateRow(params.id)}
              showInMenu
            />,
            <GridActionsCellItem
              key={'Delete Button'}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={deleteRow(params.id)}
              showInMenu
            />,
            <GridActionsCellItem
              key={'Restore Button'}
              icon={<RestoreIcon />}
              label="Restore"
              onClick={restoreRow(params.id)}
              sx={{ display: permanentDelete ? 'block' : 'none' }}
            />,
          ],
        },
      ]);
  }, [
    copyTranscription,
    data.columns,
    deleteRow,
    duplicateRow,
    permanentDelete,
    restoreRow,
    visibleColumns,
  ]);

  /* const columns: GridColDef[] = React.useMemo(() => {
    const filteredColumns = data.columns.filter((column) => visibleColumns.includes(column.field));

    const actionColumns: GridColDef[] = [
      {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params: { id: GridRowId }) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteUser(params.id)}
          />,
          <GridActionsCellItem
            icon={<FileCopyIcon />}
            label="Duplicate User"
            onClick={duplicateUser(params.id)}
            showInMenu
          />,
        ],
      },
    ];
    return {
      ...filteredColumns,
      // ...actionColumns,
    };
  }, [data.columns, deleteUser, duplicateUser, visibleColumns]); */

  React.useEffect(() => {
    setRows(data.rows as Array<Row>);
  }, [data.rows]);

  return (
    <Box sx={{ width: 1 }}>
      <DataGrid
        autoHeight
        rows={rows}
        rowHeight={120}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 100 },
          },
        }}
        onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
          if (params.reason === GridCellEditStopReasons.cellFocusOut) {
            event.defaultMuiPrevented = true;
          }
          log.debug(event);
          log.debug(params);
        }}
      />
      <Snackbar
        open={errorSnackbarOpen}
        onClose={() => setErrorSnackbarOpen(false)}
        autoHideDuration={5000}
        message={errorSnackbarMessage}
      />
      <Snackbar
        open={copySnackbarOpen}
        onClose={() => setCopySnackbarOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
      <Snackbar
        open={deleteSnackbarOpen}
        onClose={() => setDeleteSnackbarOpen(false)}
        autoHideDuration={2000}
        message="Transcription moved to Bin"
      />
      <Snackbar
        open={deletePermSnackbarOpen}
        onClose={() => setDeletePermSnackbarOpen(false)}
        autoHideDuration={2000}
        message="Transcription Permanently Deleted"
      />
      <Snackbar
        open={restoreSnackbarOpen}
        onClose={() => setRestoreSnackbarOpen(false)}
        autoHideDuration={2000}
        message="Transcription Restored"
      />
    </Box>
  );
}
