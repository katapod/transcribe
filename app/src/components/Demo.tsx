import { Box, Container, Grid, Paper } from '@mui/material';
import { useEffect, useState } from 'react';

import { EXAMPLES } from '../../data/examples';
import AudioPlayer from './audio/AudioPlayer';
import CopyToClipboardButton from './CopyToClipboardButton';

export default function Demo() {
  const [files, setFiles] = useState<File[]>([]);
  const [exampleTexts, setExampleTexts] = useState<Array<{ name: string; text: string }>>([]);

  async function createFileObjectFromLocalFile(
    filePath: string,
    name?: string
  ): Promise<File | undefined> {
    const response = await fetch(filePath);
    if (!response.ok) return;
    const blob = await response.blob();
    const file = new File([blob], name ?? filePath.split('/').pop() ?? 'Example', {
      type: blob.type,
    });
    return file;
  }

  useEffect(() => {
    async function getFiles() {
      const files = await Promise.all(
        EXAMPLES.map((example) => createFileObjectFromLocalFile(example.src, example.name))
      );
      setFiles(files.filter((file) => file !== undefined) as File[]);
    }
    getFiles();
    setExampleTexts(EXAMPLES.map((example) => ({ name: example.name, text: example.text })));
  }, []);

  return (
    <Box padding={3}>
      <Grid container component="main" sx={{ backgroundColor: '#1a1a1a' }}>
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
            <Box>{files.length > 0 && <AudioPlayer files={files} />}</Box>
          </Container>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Container
            sx={{
              overflow: 'auto',
              maxHeight: '800px',
            }}
          >
            <Box>
              <h1>Transcribed Text</h1>
              {exampleTexts &&
                exampleTexts.length > 0 &&
                exampleTexts.map((result) => {
                  return (
                    <Box key={result.name}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <CopyToClipboardButton text={result.text} />
                        <h3>{`${result.name}`}</h3>
                      </Box>
                      <p>{result.text}</p>
                    </Box>
                  );
                })}
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}
