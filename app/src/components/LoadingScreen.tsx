import { CircularProgress, Container, Typography } from '@mui/material';

export default function LoadingScreen({ message }: { message?: string }) {
  return (
    <Container
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        justifySelf: 'center',
        position: 'fixed',
        zIndex: 100000,
      }}
      fixed
    >
      <CircularProgress size={'5vw'} sx={{ margin: '2vw' }} />
      <Typography>{message ?? ''}</Typography>
    </Container>
  );
}
