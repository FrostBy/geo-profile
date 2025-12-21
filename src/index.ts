export * from './types';
export { getBrowserSignals, getDeviceInfo } from './browser';
export { getCountryFromTimezone, getCountryFromLang, calculateCountryScores } from './country';
export { createIpapiAdapter, ipapiAdapter } from './adapters/ipapi';

import type { ProfileOptions, UserProfile, GeoSignals } from './types';
import { getBrowserSignals, getDeviceInfo } from './browser';
import { calculateCountryScores } from './country';

export async function getProfile(options: ProfileOptions = {}): Promise<UserProfile> {
  const browserSignals = getBrowserSignals();
  const ipData = options.ipAdapter ? await options.ipAdapter() : null;

  const signals: GeoSignals = {
    ...browserSignals,
    ipCountry: ipData?.country || null,
    ipCity: ipData?.city || null,
    isp: ipData?.isp || null,
    isVPN: ipData?.isVPN || false,
    isProxy: ipData?.isProxy || false,
    isDatacenter: ipData?.isDatacenter || false,
  };

  return {
    signals,
    countries: calculateCountryScores(signals),
    isLocationMasked: signals.isVPN || signals.isProxy || signals.isDatacenter,
    device: getDeviceInfo(),
    timestamp: Date.now(),
  };
}
