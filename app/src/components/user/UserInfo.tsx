import { Container, FormControl, Input, InputLabel } from '@mui/material';

import type { UserData } from '../authentication/AuthProvider';

export function UserInfo({ user }: { user: UserData }) {
  return (
    <Container>
      <FormControl variant="standard">
        <InputLabel htmlFor="first-name">First Name</InputLabel>
        <Input id="first-name" aria-describedby="first-name" defaultValue={user.first_name ?? ''} />
      </FormControl>
      <FormControl variant="standard">
        <InputLabel htmlFor="last-name">Last Name</InputLabel>
        <Input id="last-name" aria-describedby="last-name" defaultValue={user.last_name ?? ''} />
      </FormControl>
    </Container>
  );
}
