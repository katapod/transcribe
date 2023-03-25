import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import Demo from '../components/Demo';
import { SectionProps } from '../components/Section';
import Pricing from '../pages/stripe/Pricing';

export const homeContent: Array<SectionProps> = [
  {
    anchorId: 'top',
    fade: 'side',
    content: [
      <div
        key={'col1'}
        style={{
          alignItems: 'flex-start',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '60px',
          paddingBottom: '60px',
        }}
      >
        <Typography variant="h1">{`
        Transcribe Your Audio to Text With Ease
        `}</Typography>
        <Typography variant="body1" marginTop={'40px'} color={'text.secondary'}>
          {`Transcribe AI is built on OpenAI's powerful Whisper model, providing high accuracy and
                  reliability.`}
        </Typography>
        <Button
          component={Link}
          to="/pricing"
          variant="contained"
          size="large"
          sx={{ marginTop: '40px' }}
        >
          Get Started
        </Button>
      </div>,
      <Box
        key={'col2'}
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/landing.png"
          alt="landing page transcription"
          height={'470px'}
          style={{
            borderRadius: '15px',
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
            marginTop: '40px',
          }}
        />
      </Box>,
    ],
  },
  {
    anchorId: 'demo',
    titleContent: {
      title: 'Demo',
      overline: 'Real Examples',
      children: <Demo />,
    },
  },
  {
    anchorId: 'how',
    titleContent: {
      title: 'How It Works',
      overline: 'How It Works',
      paragraph: `Our transcription service uses Open AI's Whisper model to transcribe audio files into
      text, providing high accuracy and reliability. Billing is handled through Stripe, and
      charges are based on the length of the audio file transcribed, rounded to the nearest
      second. All transcriptions are securely stored on our platform and can be viewed, managed,
      and deleted by the user. Our transcription service is an efficient and reliable solution
      for converting audio to text, suitable for businesses, researchers, and individuals alike.`,
      children: (
        <Box>
          <Typography>
            Sign up and start transcribing your audio files for as low as $0.007 / minute / month!
          </Typography>
          <Link to="/login">
            <Button variant="contained">Sign Up</Button>
          </Link>
        </Box>
      ),
    },
  },
  {
    anchorId: 'features',
    titleContent: {
      title: 'Features',
      overline: 'What We Offer',
      children: (
        <ul>
          <li>
            Support for multiple input and output file formats, including mp3, mp4, mpeg, mpga, m4a,
            wav, and webm.
          </li>
          <li>
            Support for a wide range of languages, including Afrikaans, Arabic, Chinese, French,
            German, Hindi, Japanese, Korean, Russian, Spanish, and{' '}
            <a href="https://github.com/openai/whisper#available-models-and-languages">
              many others
            </a>
            .
          </li>
          <li>
            Ability to transcribe audio files into any{' '}
            <a href="https://github.com/openai/whisper#available-models-and-languages">
              language supported by Open AI
            </a>{' '}
            and translate them into English.
          </li>
          <li>File splitting to transcribe large audio files in smaller fragments.</li>
          <li>
            Prompting feature to improve the accuracy of the transcribed text by providing
            contextual information to the model.
          </li>
          <li>
            High accuracy rates for transcribing speech-to-text, based on state-of-the-art
            open-source <a href="https://openai.com/research/whisper">Whisper model</a>.
          </li>
          <li>
            Transcription history to view, manage, and delete previously transcribed audio files.
          </li>
          <li>
            Pay only for what you use, with billing based on the length of the audio file
            transcribed (rounded to the nearest second).
          </li>
        </ul>
      ),
    },
  },
  {
    anchorId: 'pricing',
    fade: 'none',
    titleContent: {
      title: 'Pricing',
      overline: 'Pricing',
      children: <Pricing />,
    },
  },
  {
    anchorId: 'contact',
    titleContent: {
      title: 'Contact Us',
      overline: 'Contact Us',
      paragraph: `Have a question or feedback? Feel free to reach out to us at any time.`,
      children: (
        <Box key={'contact'}>
          <Typography>
            <a href="mailto: contact@transcribeai.app">Send Email</a>
          </Typography>
          {/* <ContactForm /> */}
        </Box>
      ),
    },
  },
];
