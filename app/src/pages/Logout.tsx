import { useAuth } from '../components/authentication/AuthProvider';

export default function Logout() {
  const { onLogout } = useAuth();
  if (!onLogout) throw new Error('onLogout is not defined');
  onLogout();
  return <></>;
}
