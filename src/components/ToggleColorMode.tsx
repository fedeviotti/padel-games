import { Button, Menu, MenuItem, useColorScheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { FC, useState } from 'react';

export const ToggleColorMode: FC = () => {
  const t = useTranslations('app_bar');
  const { mode, setMode } = useColorScheme();
  const { setTheme } = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onOptionClick = (value: 'system' | 'light' | 'dark') => {
    setMode(value);
    setTheme(value);
    handleClose();
  };

  if (!mode) {
    return null;
  }

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
      >
        {t('theme')}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={() => onOptionClick('system')}>{t('system')}</MenuItem>
        <MenuItem onClick={() => onOptionClick('light')}>{t('light')}</MenuItem>
        <MenuItem onClick={() => onOptionClick('dark')}>{t('dark')}</MenuItem>
      </Menu>
    </>
  );
};
