import '../styles/transcribe.css';

import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import Fade from 'react-reveal/Fade';
import { Link } from 'react-router-dom';

import AudioPlayer from '../components/audio/AudioPlayer';
import { useAuth } from '../components/authentication/AuthProvider';
import CopyToClipboardButton from '../components/CopyToClipboardButton';
import { Transcriber } from '../services/transcriber';

const fileTypes = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'];

const betaIds = ['fc8e6fe8-5325-4168-8404-89ce05bf8fdf', 'e5d5a42f-20f7-455a-bbb6-83795c4949a6'];
export default function Transcribe() {
  //const [originalFiles, setOriginalFiles] = useState<Array<File>>();
  const [uploadedFiles, setUploadedFiles] = useState<Array<File>>();
  const [transcribedTexts, setTranscribedTexts] = useState<
    Array<{
      fileName: string;
      text: string;
    }>
  >();

  const [prompt, setPrompt] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const handleChange = (fileList: FileList) => {
    const files = Array.from(fileList);
    //setOriginalFiles(originalFiles ? [...originalFiles, ...files] : [...files]);
    const oversizedFiles = files.filter((file) => file.size >= 25000000);
    const undersizedFiles = files.filter((file) => file.size < 25000000);
    if (undersizedFiles.length > 0) {
      setUploadedFiles(
        uploadedFiles ? [...uploadedFiles, ...undersizedFiles] : [...undersizedFiles]
      );
    }
    if (oversizedFiles.length > 0) {
      oversizedFiles.forEach((file) => {
        const newFiles = splitFile(file);
        setUploadedFiles(uploadedFiles ? [...uploadedFiles, ...newFiles] : [...newFiles]);
      });
    }
  };

  const splitFile = (file: File): Array<File> => {
    const fileParts = file.size / 25000000;
    const filePart = Math.ceil(fileParts);
    const filePartSize = Math.ceil(file.size / filePart);
    const filePartArray = [];
    for (let i = 0; i < filePart; i++) {
      const start = i * filePartSize;
      const end = start + filePartSize >= file.size ? file.size : start + filePartSize;
      filePartArray.push(file.slice(start, end));
    }
    const numOfFiles = filePartArray.length;
    const newFiles = filePartArray.map((filePart, idx) => {
      const newFile = new File([filePart], `${file.name}-${idx + 1}of${numOfFiles}`, {
        type: file.type,
        lastModified: file.lastModified,
      });
      return newFile;
    });
    return newFiles;
  };

  return (
    <Fade bottom cascade>
      <Grid container component="main" sx={{ height: '100vh', backgroundColor: '#1a1a1a' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          padding={5}
          alignContent="center"
        >
          <Container component={Paper} elevation={6} style={{ padding: '2rem' }}>
            {user?.stripe_id ? (
              <FileUploader
                handleChange={handleChange}
                name="file"
                types={fileTypes}
                label="Upload or Drop your audio files here"
                classes="file-uploader"
                multiple
              />
            ) : (
              <Button
                component={Link}
                to="/pricing"
                variant="contained"
                size="large"
                sx={{ marginTop: '40px' }}
              >
                Choose a Plan to Get Started
              </Button>
            )}
            {uploadedFiles && uploadedFiles.length > 0 && (
              <Box>
                <Box>
                  <AudioPlayer
                    files={uploadedFiles}
                    handleDeleteFile={(fileName: string) => {
                      const newFiles = uploadedFiles.filter((file) => file.name !== fileName);
                      setUploadedFiles(newFiles);
                    }}
                  />
                </Box>
                {user?.id && betaIds.includes(user.id) && (
                  <Box>
                    <Tooltip title="You can use a prompt to improve the quality of the transcripts. The model will try to match the style of the prompt, so it will be more likely to use capitalization and punctuation if the prompt does too.">
                      <Badge
                        badgeContent={'BETA'}
                        color="primary"
                        overlap="rectangular"
                        sx={{
                          padding: '0px 4px',
                          '& .MuiBadge-badge': { fontSize: 8, height: '16px' },
                        }}
                      >
                        <Typography variant="h6">Prompt</Typography>
                        <Box width="10px" />
                      </Badge>
                    </Tooltip>
                    <TextField
                      id="filled-multiline-static"
                      hiddenLabel
                      multiline
                      rows={2}
                      defaultValue="Prompt"
                      variant="filled"
                      onChange={(e) => setPrompt(e.target.value)}
                      fullWidth
                    />
                  </Box>
                )}
                <Box>
                  <Button
                    variant="contained"
                    disabled={!uploadedFiles || isLoading || uploadedFiles.length < 1}
                    onClick={async () => {
                      if (uploadedFiles && uploadedFiles.length > 0) {
                        setIsLoading(true);
                        const transcribe = new Transcriber({
                          userId: user?.id ?? '',
                        });
                        const transcriptionRequests = uploadedFiles.map((file) =>
                          transcribe.transcribeAudio(file, { prompt })
                        );
                        const texts = await Promise.all(transcriptionRequests);
                        const transcriptions = texts.map((text, idx) => {
                          const fileName = uploadedFiles
                            ? uploadedFiles[idx].name
                            : `File ${idx + 1}`;
                          return {
                            fileName,
                            text,
                          };
                        });
                        setTranscribedTexts(transcriptions);
                        setIsLoading(false);
                      }
                    }}
                  >
                    <Typography color={isLoading ? 'grey' : ''}>Transcribe Files</Typography>
                    {isLoading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: 'green',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px',
                        }}
                      />
                    )}
                  </Button>
                </Box>
              </Box>
            )}
          </Container>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Container>
            <Box>
              <h1>Transcribed Text</h1>
              <Link to="/transcribehistory">View Transcription History</Link>

              {transcribedTexts &&
                transcribedTexts.length > 0 &&
                transcribedTexts.map((result) => {
                  return (
                    <Box key={result.fileName}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <CopyToClipboardButton text={result.text} />
                        <h3>{`${result.fileName}`}</h3>
                      </Box>
                      <p>{result.text}</p>
                    </Box>
                  );
                })}
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Fade>
  );
}
