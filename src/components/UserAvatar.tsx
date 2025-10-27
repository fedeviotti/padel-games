import { Avatar } from '@mui/material';

const getInitials = (email: string | undefined) => {
  if (!email) return '?';
  const parts = email.split('@')[0].split('.');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
};

type Props = {
  userEmail: string;
};

export const UserAvatar = ({ userEmail }: Props) => {
  return (
    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.light', fontSize: '0.875rem' }}>
      {getInitials(userEmail)}
    </Avatar>
  );
};
