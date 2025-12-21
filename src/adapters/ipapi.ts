import type { IpAdapter } from '../types';

const DEFAULT_URL = 'https://api.ipapi.is';

export function createIpapiAdapter(url = DEFAULT_URL): IpAdapter {
  return async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;

      const data = await res.json();
      return {
        country: data.country_code || null,
        city: data.city || null,
        isp: data.isp || null,
        isVPN: data.is_vpn || false,
        isProxy: data.is_proxy || false,
        isDatacenter: data.is_datacenter || false,
      };
    } catch {
      return null;
    }
  };
}

export const ipapiAdapter = createIpapiAdapter();
