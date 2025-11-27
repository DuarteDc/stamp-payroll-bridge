/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const sanitizedBody = (body: any) => {
  if (!body || typeof body !== 'object') return body;
  const sensitiveKeys = [
    'password',
    'newPassword',
    'oldPassword',
    'sas',
    'confirmPassword',
    'pass',
    'token',
    'secret',
  ];
  const clone = { ...body };
  for (const key of Object.keys(clone)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      clone[key] = '*******************';
    } else if (typeof clone[key] === 'object') {
      clone[key] = sanitizedBody(clone[key]);
    }
  }
  return clone;
};
