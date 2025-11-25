/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const getRealIp = (req: any): string => {
  const forwarded = req.headers['x-forwarded-for'];

  let ip =
    forwarded?.split(',')?.trim() ||
    req?.connection.remoteAddress ||
    req?.socket?.remoteAddress ||
    req.ip;

  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }

  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  return ip;
};
