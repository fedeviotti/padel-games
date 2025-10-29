'use client';

import {
  AccountCircleOutlined,
  DarkModeOutlined,
  LaptopChromebookOutlined,
  LightModeOutlined,
  LogoutOutlined,
  PaletteOutlined,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useColorScheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { stackClientApp } from '@/stack/client';
import { UserAvatar } from './UserAvatar';

export function UserButton() {
  const t = useTranslations('app_bar');
  const user = stackClientApp.useUser();
  const router = useRouter();
  const { mode, setMode } = useColorScheme();
  const { setTheme } = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const themeMenuOpen = Boolean(themeMenuAnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    if (user) {
      await user.signOut();
      handleClose();
      router.push('/');
    }
  };

  const handleAccountSettings = () => {
    router.push('/handler/account-settings');
    handleClose();
  };

  const handleThemeSelector = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setThemeMenuAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchorEl(null);
  };

  const handleThemeOptionClick = (value: 'system' | 'light' | 'dark') => {
    setMode(value);
    setTheme(value);
    handleThemeMenuClose();
    handleClose();
  };

  const userEmail = user?.primaryEmail ?? '';

  return (
    <>
      <IconButton onClick={handleClick} size="small" aria-label="user menu" color="inherit">
        {user ? (
          <UserAvatar userEmail={userEmail} />
        ) : (
          <AccountCircleOutlined sx={{ fontSize: 32 }} />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { minWidth: 200 },
          },
        }}
      >
        {user
          ? [
              <Box
                key="user-email"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75 }}
              >
                <UserAvatar userEmail={userEmail} />
                <Typography variant="body1" noWrap>
                  {userEmail}
                </Typography>
              </Box>,
              <Divider key="divider" />,
              <MenuItem key="account-settings" onClick={handleAccountSettings}>
                <ListItemIcon>
                  <AccountCircleOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('settings')}</ListItemText>
              </MenuItem>,
              <MenuItem key="theme-selector" onClick={handleThemeSelector}>
                <ListItemIcon>
                  <PaletteOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('theme')}</ListItemText>
              </MenuItem>,
              <Menu
                key="theme-submenu"
                anchorEl={themeMenuAnchorEl}
                open={themeMenuOpen}
                onClose={handleThemeMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={() => handleThemeOptionClick('system')}
                  selected={mode === 'system'}
                >
                  <ListItemIcon>
                    <LaptopChromebookOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('system')}</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => handleThemeOptionClick('light')}
                  selected={mode === 'light'}
                >
                  <ListItemIcon>
                    <LightModeOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('light')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleThemeOptionClick('dark')} selected={mode === 'dark'}>
                  <ListItemIcon>
                    <DarkModeOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('dark')}</ListItemText>
                </MenuItem>
              </Menu>,
              <MenuItem key="sign-out" onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('sign_out')}</ListItemText>
              </MenuItem>,
            ]
          : [
              <Box
                key="not-signed-in"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75 }}
              >
                <AccountCircleOutlined sx={{ fontSize: 32 }} />
                <Typography variant="body1">{t('not_signed_in')}</Typography>
              </Box>,
              <Divider key="divider" />,
              <MenuItem
                key="sign-in"
                component={Link}
                href="/handler/sign-in"
                onClick={handleClose}
              >
                <ListItemText>{t('sign_in')}</ListItemText>
              </MenuItem>,
              <MenuItem
                key="sign-up"
                component={Link}
                href="/handler/sign-up"
                onClick={handleClose}
              >
                <ListItemText>{t('sign_up')}</ListItemText>
              </MenuItem>,
            ]}
      </Menu>
    </>
  );
}
