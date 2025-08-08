// Utilities for user display formatting
export const getFullName = (user) => {
  if (!user) return '';
  const first = (user.firstName || '').trim();
  const last = (user.lastName || '').trim();
  const full = `${first} ${last}`.trim();
  return full || user.username || '';
};

export const getHandle = (user) => {
  if (!user?.username) return '';
  return `@${user.username}`;
};

export const getInitials = (user) => {
  if (!user) return 'U';
  const first = (user.firstName || '').trim();
  const last = (user.lastName || '').trim();
  const fromName = `${first.charAt(0)}${last.charAt(0)}`.trim();
  if (fromName) return fromName.toUpperCase();
  const fromUsername = (user.username || '').charAt(0);
  return (fromUsername || 'U').toUpperCase();
};

