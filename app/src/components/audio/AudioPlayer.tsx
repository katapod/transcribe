import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import FileInfo from '../FileInfo';
import AudioControls from './AudioControls';
import AudioSource from './AudioSource';

export default function AudioPlayer({
  files,
  handleDeleteFile,
}: {
  files: Array<File>;
  handleDeleteFile?: (fileName: string) => void;
}) {
  const [duration, setDuration] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File>(files[0]);
  const [fileIndex, setFileIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

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

  useEffect(() => {
    getDuration(selectedFile).then((duration) => {
      setDuration(duration);
    });
  }, [selectedFile]);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <AudioSource file={selectedFile} audioRef={audioRef} />
      {duration > 0 && audioRef.current && (
        <AudioControls
          file={selectedFile}
          audioRef={audioRef}
          metadata={{ duration }}
          numberOfFiles={files.length}
          fileIndex={fileIndex}
          handleNext={() => {
            if (fileIndex < files.length - 1) {
              setFileIndex(fileIndex + 1);
              setSelectedFile(files[fileIndex + 1]);
            }
          }}
          handlePrevious={() => {
            if (fileIndex > 0) {
              setFileIndex(fileIndex - 1);
              setSelectedFile(files[fileIndex - 1]);
            }
          }}
        />
      )}
      {files.map((file, index) => (
        <FileInfo
          key={file.name}
          file={file}
          isSelected={index === fileIndex}
          handleSelectFile={() => {
            setFileIndex(index);
            setSelectedFile(files[index]);
          }}
          handleDeleteFile={() => {
            if (handleDeleteFile) {
              handleDeleteFile(file.name);
            }
          }}
          disableDelete={!handleDeleteFile}
        />
      ))}
    </Box>
  );
}
