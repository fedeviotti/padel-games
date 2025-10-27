'use client';

import { AccountCircle, Logout } from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { stackClientApp } from '@/stack/client';
import { UserAvatar } from './UserAvatar';

export function UserButton() {
  const t = useTranslations('app_bar');
  const user = stackClientApp.useUser();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const userEmail = user?.primaryEmail ?? '';

  return (
    <>
      <IconButton onClick={handleClick} size="small" aria-label="user menu" color="inherit">
        {user ? <UserAvatar userEmail={userEmail} /> : <AccountCircle sx={{ fontSize: 32 }} />}
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
              <MenuItem key="sign-out" onClick={handleSignOut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('sign_out')}</ListItemText>
              </MenuItem>,
            ]
          : [
              <Box
                key="not-signed-in"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75 }}
              >
                <AccountCircle sx={{ fontSize: 32 }} />
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
