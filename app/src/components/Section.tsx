import { Box, Container, Grid, Typography } from '@mui/material';
import Fade from 'react-reveal/Fade';

export type FadeOption = 'left' | 'right' | 'top' | 'bottom' | 'none' | 'side';

export interface SectionProps {
  anchorId: string;
  titleContent?: {
    title: string;
    overline?: string;
    paragraph?: string;
    children?: React.ReactNode;
  };
  content?: Array<React.ReactNode>;
  version?: 'primary' | 'secondary' | 'even';
  fade?: FadeOption;
}

export default function Section({
  anchorId,
  titleContent,
  content = [],
  version = 'primary',
  fade = 'bottom',
}: SectionProps) {
  if (titleContent) {
    content.unshift(
      <Box>
        <Box>
          {titleContent.overline && (
            <Typography variant="overline">{titleContent.overline}</Typography>
          )}
        </Box>
        <Box>
          <Typography variant="h2">{titleContent.title}</Typography>
        </Box>
        <Box>
          {titleContent.paragraph && (
            <Typography variant="body1">{titleContent.paragraph}</Typography>
          )}
        </Box>
        {titleContent.children && <Box>{titleContent.children}</Box>}
      </Box>
    );
  }
  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: '60px',
      }}
      className="section"
      id={anchorId}
    >
      <Grid container spacing={4}>
        {content.map((item, index) => (
          <Grid
            item
            xs={12}
            md={
              content.length === 1
                ? 12
                : version === 'primary'
                ? index % 2 === 0
                  ? 5
                  : 7
                : version === 'secondary'
                ? index % 2 === 0
                  ? 7
                  : 5
                : version === 'even'
                ? 6
                : 12
            }
            key={index}
          >
            <Fade
              {...(fade
                ? fade === 'side'
                  ? { left: index % 2 === 0, right: index % 2 !== 0 }
                  : { [fade]: true }
                : {})}
              cascade
            >
              {item}
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
