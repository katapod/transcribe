import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography } from '@mui/material';

import { PlanFeature } from '../../pages/stripe/Pricing';

export interface PricingFeatureRowData {
  feature: string;
  description?: string;
  plans: Array<PlanFeature>;
}

export default function PricingFeatureRow({ data }: { data: PricingFeatureRowData }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(120px, 1fr) repeat(3, minmax(160px, 1fr))',
          md: 'minmax(160px, 1fr) repeat(3, minmax(230px, 1fr))',
        },
        ':hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          paddingLeft: '10px',
          paddingRight: '10px',
          alignSelf: 'center',
          justifySelf: 'flex-start',
        }}
      >
        <Typography>{data.feature}</Typography>
      </Box>
      {data.plans.map((features, idx) => (
        <Box
          key={`${features.planName}-${features.feature ? features.feature.name : idx}`}
          sx={{
            paddingTop: '18px',
            paddingBottom: '18px',
            paddingLeft: '20px',
            paddingRight: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: '0 1px 0 1px',
            borderStyle: 'solid',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          }}
        >
          {features.feature &&
            (features.feature.note ? (
              <Typography>{features.feature.note}</Typography>
            ) : (
              <CheckCircleIcon />
            ))}
        </Box>
      ))}
    </Box>
  );
}
