import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardRate({ value, sx }: { value: number; sx: SxProps<Theme> }) {
  const navigate = useNavigate();
  const [rateInterval, setRateInterval] = React.useState<'minute' | 'second' | 'hour'>('minute');
  const [rates, setRates] = React.useState<{ [key: string]: number }>({
    second: 0,
    minute: 0,
    hour: 0,
  });
  const [rateStrings, setRateStrings] = React.useState<{ [key: string]: string }>({
    second: '',
    minute: '',
    hour: '',
  });

  const handleNewInterval = (
    event: React.MouseEvent<HTMLElement>,
    interval: 'minute' | 'second' | 'hour'
  ) => {
    setRateInterval(interval);
  };

  function formatDecimal(number: number): string {
    if (number > 0.01) {
      const numberString = number.toFixed(3).replace(/\.?0+$/, '');
      const [, decimal] = numberString.split('.');
      if (decimal.length < 2) return parseFloat(numberString).toFixed(2);
      return numberString;
    }
    const stringified = number.toString();
    const decimalIndex = stringified.indexOf('.');
    if (decimalIndex < 0) {
      return stringified;
    }
    const nonRepeating = stringified.substring(0, decimalIndex);
    const repeating = stringified.substring(decimalIndex + 1);
    for (let i = 1; i < repeating.length; i++) {
      const sliced = repeating.slice(0, i);
      if (
        repeating.repeat(Math.floor(repeating.length / i)) ===
        sliced.repeat(Math.ceil(repeating.length / i)).slice(0, repeating.length)
      ) {
        return `${nonRepeating}.${repeating.slice(0, i)}`;
      }
    }
    return number.toFixed(5);
  }

  useEffect(() => {
    setRates({
      second: value / 100,
      minute: (value * 60) / 100,
      hour: (value * 60 * 60) / 100,
    });
  }, [value]);

  useEffect(() => {
    setRateStrings({
      second: `$${rates.second}/s`,
      minute: `$${formatDecimal(rates.minute)}/m`,
      hour: `$${formatDecimal(rates.hour)}/h`,
    });
  }, [rates]);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Rate
            </Typography>
            <Box
              alignContent={'center'}
              justifyContent={'center'}
              sx={{
                marginTop: '-5px !important',
              }}
            >
              <ToggleButtonGroup
                color="primary"
                value={rateInterval}
                exclusive
                onChange={handleNewInterval}
                aria-label="Platform"
                size="small"
              >
                <ToggleButton
                  sx={{
                    padding: '1px 6px',
                    fontSize: '0.66rem',
                  }}
                  value="hour"
                >
                  Hour
                </ToggleButton>
                <ToggleButton
                  sx={{
                    padding: '1px 6px',
                    fontSize: '0.66rem',
                  }}
                  value="minute"
                >
                  Minute
                </ToggleButton>
                <ToggleButton
                  sx={{
                    padding: '1px 6px',
                    fontSize: '0.66rem',
                  }}
                  value="second"
                >
                  Second
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Typography variant="h4">{rateStrings[rateInterval]}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/pricing')}>
            Upgrade Plan
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
