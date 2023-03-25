import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import TranscribeIcon from '@mui/icons-material/Transcribe';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { useAuth } from './authentication/AuthProvider';
import { useTheme } from './theme/ThemeModeProvider';

interface PageLink {
  name: string;
  link: string;
}

const pages: Array<PageLink> = [
  { name: 'How it Works', link: 'how' },
  { name: 'Pricing', link: 'pricing' },
  { name: 'Features', link: 'features' },
  { name: 'Contact', link: 'contact' },
];
const settings: Array<PageLink> = [
  { name: 'Account', link: 'account' },
  { name: 'Dashboard', link: 'dashboard' },
  { name: 'Logout', link: 'logout' },
];

export default function Navbar() {
  const { user } = useAuth();
  const { colorMode } = useTheme();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [actionLinks, setActionLinks] = React.useState<Array<PageLink>>([]);
  const [currentPath, setCurrentPath] = React.useState<string>('');

  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    if (user?.id) {
      setActionLinks([{ name: 'Transcribe', link: 'transcribe' }]);
    } else {
      setActionLinks([{ name: 'Get Started', link: 'login' }]);
    }
  }, [user]);

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const renderLink = (page: PageLink, overrideLink?: boolean) => {
    if (!overrideLink && (currentPath === '/' || currentPath === '')) {
      return (
        <MenuItem
          key={page.name}
          onClick={() => {
            handleCloseUserMenu();
            scrollToSection(page.link);
          }}
          sx={{ my: 2, display: 'block', color: 'button.text.primary' }}
        >
          <Typography textAlign="center">{page.name}</Typography>
        </MenuItem>
      );
    } else {
      return (
        <Box
          onClick={() => {
            navigate(page.link);
          }}
          key={page.name}
        >
          <MenuItem
            key={page.name}
            onClick={handleCloseUserMenu}
            sx={{
              my: 2,
              display: 'block',
              color: 'button.text.primary',
            }}
          >
            <Typography textAlign="center">{page.name}</Typography>
          </MenuItem>
        </Box>
      );
    }
  };

  const renderLogo = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <Box onClick={() => scrollToSection('top')}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'button.text.primary',
              textDecoration: 'none',
              ':hover': {
                cursor: 'pointer',
              },
            }}
          >
            TRANSCRIBE
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box
          onClick={() => {
            navigate('/');
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'button.text.primary',
              textDecoration: 'none',
              ':hover': {
                cursor: 'pointer',
              },
            }}
          >
            TRANSCRIBE
          </Typography>
        </Box>
      );
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TranscribeIcon
            sx={{ color: 'button.text.primary', display: { xs: 'none', md: 'flex' }, mr: 1 }}
          />
          <Box sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>{renderLogo()}</Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => renderLink(page))}
            </Menu>
          </Box>
          <TranscribeIcon
            sx={{ color: 'button.text.primary', display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
          <Box sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>{renderLogo()}</Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => renderLink(page))}
          </Box>
          <Box sx={{ marginRight: '12px', display: { xs: 'none', md: 'flex' } }}>
            {actionLinks.map((action) => renderLink(action, true))}
            <IconButton
              aria-label="toggle colour mode"
              onClick={colorMode?.toggleColorMode}
              style={{
                color: 'white',
              }}
            >
              {colorMode?.currentMode === 'light' ? (
                <DarkModeIcon fontSize="medium" />
              ) : (
                <LightModeIcon fontSize="medium" />
              )}
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.first_name.toUpperCase()} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user && user.id ? (
                settings.map((setting) => (
                  <Link key={setting.name} to={setting.link}>
                    <MenuItem
                      key={setting.name}
                      onClick={handleCloseUserMenu}
                      sx={{ color: 'text.primary' }}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  </Link>
                ))
              ) : (
                <Link to="/login">
                  <MenuItem
                    key="Login"
                    onClick={handleCloseUserMenu}
                    sx={{ color: 'text.primary' }}
                  >
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                </Link>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
