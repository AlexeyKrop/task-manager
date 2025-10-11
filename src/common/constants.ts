export const getJwtConstants = () => {
  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!accessSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return {
    access: {
      secret: accessSecret,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    refresh: {
      secret: refreshSecret,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  };
};
