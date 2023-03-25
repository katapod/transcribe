import { Box, Container, Grid } from '@mui/material';
import log from 'loglevel';
import { Suspense, useEffect, useState } from 'react';
import Fade from 'react-reveal/Fade';
import { Await, useLoaderData } from 'react-router-dom';

import { useAuth } from '../components/authentication/AuthProvider';
import DashboardCost from '../components/dashboard/overview/DashboardCost';
import DashboardCredits from '../components/dashboard/overview/DashboardCredits';
import DashboardRate from '../components/dashboard/overview/DashboardRate';
import DashboardTranscriptions from '../components/dashboard/overview/DashboardTranscriptions';
import DashboardUsage from '../components/dashboard/overview/DashboardUsage';

type LoaderData = {
  transcriptionsPromise: Promise<Array<TranscriptionHistory>>;
};

export interface TranscriptionHistory {
  id: string;
  created_at: string;
  supabase_id: string;
  transcription: string;
  file_size: string;
  file_duration: string;
  file_type: string;
  idempotency_key: string;
}

export default function Dashboard() {
  const { transcriptionsPromise } = useLoaderData() as LoaderData;

  return (
    <Suspense>
      <Await
        resolve={transcriptionsPromise}
        errorElement={<div>Something went wrong!</div>}
        // TODO: work this out
        // eslint-disable-next-line react/no-children-prop
        children={(transcriptions) => <DashboardContents transcriptions={transcriptions} />}
      />
    </Suspense>
  );
}

function DashboardContents({ transcriptions }: { transcriptions?: TranscriptionHistory[] }) {
  const { user, supabase } = useAuth();
  const [latestTranscriptions, setLatestTranscriptions] = useState<TranscriptionHistory[]>(
    transcriptions ?? []
  );
  // TODO: fix the any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [latestInvoice, setLatestInvoice] = useState<any>({});
  const [totalUsage, setTotalUsage] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [invoiceRange, setInvoiceRange] = useState<{
    start: string;
    end: string;
  }>({ start: '', end: '' });
  const [creditMax, setCreditMax] = useState<number>(0);

  async function refreshLatestInvoice({ supabaseId }: { supabaseId: string }) {
    const res = await fetch('/api/stripe/upcoming-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabaseId,
      }),
    });

    const body = await res.json();
    log.debug(body);
    setLatestInvoice(body);
    const trackedUsages = body?.lines?.data;
    const total = trackedUsages?.reduce(
      (acc: number, curr: { quantity: number }) => acc + curr?.quantity,
      0
    );
    const adjustedTotal = total ? total - 1 : 0;
    setTotalUsage(adjustedTotal);

    const line = body?.lines.data.find(
      // TODO: fix the any type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (line: any) => line.price.recurring.usage_type === 'metered'
    );
    log.debug('line', line);

    const unitAmountDecimal = line?.price.unit_amount_decimal;

    log.debug('unit amount', unitAmountDecimal);

    if (unitAmountDecimal) {
      const totalRate = parseFloat(unitAmountDecimal) ?? 0;
      log.debug('totalRate', totalRate);
      setRate(totalRate);
    } else {
      setRate(0);
    }

    setInvoiceRange({
      start: new Date(body?.period_start * 1000).toLocaleDateString(),
      end: new Date(body?.period_end * 1000).toLocaleDateString(),
    });

    const isBasic = (line.description as string).includes('Basic');
    const isPro = (line.description as string).includes('Pro');
    const isBusiness = (line.description as string).includes('Business');

    setCreditMax(isBasic ? 0 : isPro ? 30000 : isBusiness ? 90000 : 0);
  }

  const renderDashItems = () => {
    const dashItems = [
      <DashboardUsage
        key={'DashboardUsage'}
        difference={16}
        positive={false}
        sx={{
          height: '100%',
          boxShadow: `rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px`,
          borderRadius: '20px',
        }}
        value={`${totalUsage} s`}
        range={invoiceRange}
      />,
      <DashboardCost
        key={'DashboardCost'}
        difference={12}
        positive
        sx={{
          height: '100%',
          boxShadow: `rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px`,
          borderRadius: '20px',
        }}
        value={`$${((latestInvoice?.total ?? 0) / 100).toFixed(2)}`}
        range={invoiceRange}
      />,
      <DashboardRate
        key={'DashboardRate'}
        sx={{
          height: '100%',
          boxShadow: `rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px`,
          borderRadius: '20px',
        }}
        value={rate}
      />,

      <DashboardCredits
        key={'DashboardProgress'}
        sx={{
          height: '100%',
          boxShadow: `rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px`,
          borderRadius: '20px',
        }}
        value={totalUsage}
        max={creditMax}
      />,
    ];
    return dashItems.map((item) => (
      <Grid
        key={item.key}
        xs={12}
        sm={6}
        lg={3}
        sx={{
          padding: '32px 24px',
        }}
      >
        {item}
      </Grid>
    ));
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.client
      .from('transcriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setLatestTranscriptions(data as TranscriptionHistory[]);
        window.localStorage.setItem(
          'transcriptions',
          JSON.stringify(data as TranscriptionHistory[])
        );
      });
  }, [supabase, transcriptions]);

  useEffect(() => {
    refreshLatestInvoice({
      supabaseId: user?.id ?? '',
    });
  }, [user?.id]);
  return (
    <Fade bottom cascade>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {renderDashItems()}
            {/* <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: 'This year',
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                  {
                    name: 'Last year',
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                  },
                ]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={['Desktop', 'Tablet', 'Phone']}
                sx={{ height: '100%' }}
              />
            </Grid> */}
            <Grid
              xs={12}
              md={12}
              lg={12}
              sx={{
                padding: '32px 24px',
              }}
            >
              <DashboardTranscriptions
                transcriptions={latestTranscriptions}
                sx={{
                  height: '100%',
                  boxShadow: `rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px`,
                  borderRadius: '20px',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
}
