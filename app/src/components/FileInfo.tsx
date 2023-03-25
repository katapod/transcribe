import '../styles/file.css';

import { VolumeUp } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton } from '@mui/material';
import { filesize } from 'filesize';
import { useEffect, useState } from 'react';

export default function FileInfo({
  file,
  isSelected,
  handleSelectFile,
  handleDeleteFile,
  disableDelete,
}: {
  file: File;
  isSelected: boolean;
  handleSelectFile: () => void;
  handleDeleteFile?: () => void;
  disableDelete?: boolean;
}) {
  const [duration, setDuration] = useState(0);

  async function getDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const audioContext = new AudioContext();
        audioContext.decodeAudioData(reader.result as ArrayBuffer).then((buffer) => {
          const duration = buffer.duration;
          resolve(duration);
        });
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

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

  useEffect(() => {
    getDuration(file).then((duration) => {
      setDuration(duration);
    });
  }, [file]);
  return (
    <Box key={file.name} className="file-info">
      <div className="file-name">
        <IconButton
          aria-label={isSelected ? '' : 'select'}
          onClick={handleSelectFile}
          disabled={isSelected}
        >
          {isSelected ? (
            <VolumeUp sx={{ fontSize: '2rem' }} htmlColor={'button.text.primary'} />
          ) : (
            <VolumeUp sx={{ fontSize: '2rem' }} htmlColor={'rgb(124 124 124)'} />
          )}
        </IconButton>
        <p>{file.name}</p>
      </div>
      <div className="file-stats">
        {handleDeleteFile && !disableDelete && (
          <IconButton aria-label="delete audio file" onClick={handleDeleteFile}>
            <DeleteIcon />
          </IconButton>
        )}
        <p>{formatTime(duration)}</p>
        <p>{filesize(file.size).toString()}</p>
      </div>
    </Box>
  );
}
