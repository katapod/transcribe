import { Box, Button, Container, FormControl, TextField } from '@mui/material';
import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(false);
    setErrorMessage('');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
      setSuccess(true);
    } catch (error: any) {
      setError(true);
      setErrorMessage(error.message);
    }
    setSubmitting(false);
  };

  return (
    <Container>
      <FormControl onSubmit={handleSubmit} fullWidth>
        <Box>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            sx={{
              margin: 1,
            }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            sx={{
              margin: 1,
            }}
          />
        </Box>
        <TextField
          label="Message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          multiline
          fullWidth
          required
          rows={5}
          sx={{
            margin: 1,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{
            margin: 1,
          }}
        >
          Submit
        </Button>
        {success && <p>Thanks for contacting us!</p>}
      </FormControl>
    </Container>
  );
}
