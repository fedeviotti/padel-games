import { Button, Menu, MenuItem, useColorScheme } from '@mui/material';
import { useTheme } from 'next-themes';
import { FC, useState } from 'react';

export const ToggleColorMode: FC = () => {
  const { mode, setMode } = useColorScheme();
  const { setTheme: setNextTheme } = useTheme();

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
    setNextTheme(value);
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
        Theme
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
        <MenuItem onClick={() => onOptionClick('system')}>System</MenuItem>
        <MenuItem onClick={() => onOptionClick('light')}>Light</MenuItem>
        <MenuItem onClick={() => onOptionClick('dark')}>Dark</MenuItem>
      </Menu>
    </>
  );
};
