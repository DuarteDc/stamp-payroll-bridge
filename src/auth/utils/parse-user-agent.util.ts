import { UAParser } from 'ua-parser-js';

export const parseUserAgent = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    deviceType: result.device.type ?? 'desktop',
    deviceBrand: result.device.vendor ?? '',
    deviceModel: result.device.model ?? '',
    os: result?.os?.name ?? '',
    browser: result?.browser?.name ?? '',
    //     browserVersion: result.browser.version,
  };
};
