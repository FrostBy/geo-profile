export enum Platform {
  Windows = 'Windows',
  MacOS = 'MacOS',
  Linux = 'Linux',
  Android = 'Android',
  iOS = 'iOS',
  Unknown = 'Unknown',
}

export enum Browser {
  Chrome = 'Chrome',
  Firefox = 'Firefox',
  Safari = 'Safari',
  Edge = 'Edge',
  Opera = 'Opera',
  Unknown = 'Unknown',
}

export interface IpData {
  country: string | null;
  city: string | null;
  isp: string | null;
  isVPN: boolean;
  isProxy: boolean;
  isDatacenter: boolean;
}

export type IpAdapter = () => Promise<IpData | null>;

export interface GeoSignals {
  timezone: string;
  timezoneCountry: string | null;
  language: string;
  languageCountry: string | null;
  languages: string[];
  ipCountry: string | null;
  ipCity: string | null;
  isp: string | null;
  isVPN: boolean;
  isProxy: boolean;
  isDatacenter: boolean;
}

export interface CountryScore {
  code: string;
  probability: number;
  sources: string[];
}

export interface DeviceInfo {
  platform: Platform;
  isMobile: boolean;
  browser: Browser;
  memory: number | null;
  cpuCores: number | null;
  screen: { w: number; h: number; dpr: number };
  connection: string | null;
}

export interface UserProfile {
  signals: GeoSignals;
  countries: CountryScore[];
  isLocationMasked: boolean;
  device: DeviceInfo;
  timestamp: number;
}

export interface ProfileOptions {
  ipAdapter?: IpAdapter;
}
