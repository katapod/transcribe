import '../../styles/pricing.css';

import { Box, Container, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import * as React from 'react';
import Fade from 'react-reveal/Fade';

import { Feature, plans } from '../../../data/stripe';
import { useAuth } from '../../components/authentication/AuthProvider';
import PricingFeatureRow, {
  PricingFeatureRowData,
} from '../../components/pricing/PricingFeatureRow';
import PricingPlanRow from '../../components/pricing/PricingPlanRow';

export interface PlanFeature {
  planName: string;
  feature: Feature | false;
}

function getFeatureByName(name: string): Array<PlanFeature> {
  const features: Array<PlanFeature> = [];
  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    const feature = plan.features.find((feature) => feature.name === name);
    if (feature) {
      features.push({
        planName: plan.name,
        feature,
      });
    } else if (i > 0 && plans[i - 1]) {
      features.push({
        planName: plan.name,
        feature: features[i - 1].feature,
      });
    } else {
      features.push({
        planName: plan.name,
        feature: false,
      });
    }
  }
  return features;
}

export default function Pricing() {
  const [period, setPeriod] = React.useState<'monthly' | 'yearly'>('yearly');
  const [rateInterval, setRateInterval] = React.useState<'minute' | 'second' | 'hour'>('minute');

  const { user } = useAuth();

  const handleNewInterval = (
    event: React.MouseEvent<HTMLElement>,
    interval: 'minute' | 'second' | 'hour'
  ) => {
    setRateInterval(interval);
  };

  const allFeatureNames: string[] = [
    ...new Set(plans.flatMap((plan) => plan.features.map((feature) => feature.name))),
  ];

  const features: Array<PricingFeatureRowData> = allFeatureNames.map((name) => {
    return {
      feature: name,
      plans: getFeatureByName(name),
    };
  });

  return (
    <Container>
      <Fade bottom cascade>
        <Box alignContent={'center'} justifyContent={'center'} textAlign={'center'}>
          <div
            className="switch-wrapper"
            tabIndex={0}
            role={'switch'}
            aria-checked={period === 'yearly'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setPeriod(period === 'monthly' ? 'yearly' : 'monthly');
            }}
            onClick={() => setPeriod(period === 'monthly' ? 'yearly' : 'monthly')}
          >
            <input
              disabled
              id="monthly"
              type="radio"
              name="switch"
              checked={period === 'monthly'}
            />
            <input disabled id="yearly" type="radio" name="switch" checked={period === 'yearly'} />
            <label
              htmlFor="monthly"
              style={{
                color: period === 'monthly' ? 'white' : 'black',
              }}
            >
              Monthly
            </label>
            <label
              htmlFor="yearly"
              style={{
                color: period === 'yearly' ? 'white' : 'black',
              }}
            >
              Yearly
            </label>
            <span className="highlighter"></span>
          </div>
        </Box>
        <Box
          alignContent={'center'}
          justifyContent={'center'}
          textAlign={'center'}
          sx={{
            marginTop: '-5px !important',
            marginBottom: '15px !important',
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
                fontSize: '0.8rem',
              }}
              value="hour"
            >
              Hour
            </ToggleButton>
            <ToggleButton
              sx={{
                padding: '1px 6px',
                fontSize: '0.8rem',
              }}
              value="minute"
            >
              Minute
            </ToggleButton>
            <ToggleButton
              sx={{
                padding: '1px 6px',
                fontSize: '0.8rem',
              }}
              value="second"
            >
              Second
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            width: '100%',
            overflow: 'auto',
          }}
        >
          <PricingPlanRow
            plans={plans}
            period={period}
            rateInterval={rateInterval}
            guest={!user?.stripe_id}
          />
          {features.map((feature) => (
            <PricingFeatureRow key={`header-${feature.feature}`} data={feature} />
          ))}
          <Divider />
        </Box>
      </Fade>
    </Container>
  );
}
