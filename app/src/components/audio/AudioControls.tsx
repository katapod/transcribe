import styled from '@emotion/styled';
import {
  FastForwardRounded,
  FastRewindRounded,
  PauseRounded,
  PlayArrowRounded,
  VolumeDownRounded,
  VolumeUpRounded,
} from '@mui/icons-material';
import { Box, IconButton, Slider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const Widget = styled('div')(() => ({
  padding: 16,
  marginTop: 16,
  borderRadius: 16,
  maxWidth: '100%',
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(40px)',
}));

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export interface Metadata {
  duration: number;
}

export default function AudioControls({
  file,
  audioRef,
  metadata,
  numberOfFiles,
  fileIndex,
  handleNext,
  handlePrevious,
}: {
  file: File;
  audioRef: React.RefObject<HTMLAudioElement>;
  metadata: Metadata;
  numberOfFiles: number;
  fileIndex: number;
  handleNext: () => void;
  handlePrevious: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${Math.round(secondLeft)}` : Math.round(secondLeft)}`;
  }

  const mainIconColor = '#fff';
  const lightIconColor = 'rgba(255,255,255,0.4)';

  useEffect(() => {
    const onTimeUpdate = () => {
      if (!audioRef.current) return;
      setPosition(audioRef.current.currentTime);
    };
    if (!audioRef.current) return;
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);
    const ref = audioRef.current;
    return () => ref.removeEventListener('timeupdate', onTimeUpdate);
  }, [audioRef]);

  useEffect(() => {
    const onEnded = () => {
      if (!audioRef.current) return;
      setPosition(0);
      setIsPlaying(false);
    };
    if (!audioRef.current) return;
    audioRef.current.addEventListener('ended', onEnded);
    const ref = audioRef.current;
    return () => ref.removeEventListener('ended', onEnded);
  }, [audioRef]);

  useEffect(() => {
    setPosition(0);
    setIsPlaying(false);
  }, [fileIndex]);

  return (
    <Widget>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ ml: 1.5, minWidth: 0 }}>
          <Typography variant="caption" color="white" fontWeight={500}>
            {`~$${(Math.round(metadata.duration) * 0.001).toFixed(2)} (${Math.round(
              metadata.duration
            )}s)`}
          </Typography>
          <Typography color="white" noWrap>
            <b>{file.name}</b>
          </Typography>
        </Box>
      </Box>

      <Slider
        aria-label="time-indicator"
        size="small"
        value={position}
        min={0}
        max={metadata.duration}
        onChange={(_, value) => {
          if (!audioRef.current) return;
          audioRef.current.currentTime = value as number;
        }}
        sx={{
          color: '#fff',
          height: 4,
          '& .MuiSlider-thumb': {
            width: 8,
            height: 8,
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
            '&:before': {
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
            },
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
            },
            '&.Mui-active': {
              width: 20,
              height: 20,
            },
          },
          '& .MuiSlider-rail': {
            opacity: 0.28,
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: -2,
        }}
      >
        <TinyText color="white">{formatDuration(audioRef.current?.currentTime ?? 0)}</TinyText>
        <TinyText color="white">
          -{formatDuration(metadata.duration - (audioRef.current?.currentTime ?? 0))}
        </TinyText>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: -1,
        }}
      >
        <IconButton aria-label="previous song" onClick={handlePrevious} disabled={fileIndex === 0}>
          <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
        </IconButton>
        <IconButton
          aria-label={isPlaying ? 'pause' : 'play'}
          onClick={() => {
            if (audioRef.current) {
              if (audioRef.current.paused) {
                audioRef.current.play();
                setIsPlaying(true);
              } else {
                audioRef.current.pause();
                setIsPlaying(false);
              }
            }
          }}
        >
          {isPlaying ? (
            <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
          ) : (
            <PlayArrowRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
          )}
        </IconButton>
        <IconButton
          aria-label="next song"
          onClick={handleNext}
          disabled={fileIndex >= numberOfFiles - 1}
        >
          <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
        </IconButton>
      </Box>
      <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
        <VolumeDownRounded htmlColor={lightIconColor} />
        <Slider
          aria-label="Volume"
          defaultValue={100}
          size="small"
          onChange={(_, value) => {
            if (!audioRef.current) return;
            audioRef.current.volume = (value as number) / 100;
          }}
          sx={{
            color: '#fff',
            '& .MuiSlider-track': {
              border: 'none',
            },
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              backgroundColor: '#fff',
              '&:before': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible, &.Mui-active': {
                boxShadow: 'none',
              },
            },
          }}
        />
        <VolumeUpRounded htmlColor={lightIconColor} />
      </Stack>
    </Widget>
  );
}
