import { Platform, Browser, type GeoSignals, type DeviceInfo } from './types';
import { getCountryFromTimezone, getCountryFromLang } from './country';

export function getBrowserSignals(): Pick<GeoSignals, 'timezone' | 'timezoneCountry' | 'language' | 'languageCountry' | 'languages'> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;

  return {
    timezone,
    timezoneCountry: getCountryFromTimezone(timezone),
    language,
    languageCountry: getCountryFromLang(language),
    languages: [...navigator.languages],
  };
}

export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string };
  };

  return {
    platform: detectPlatform(ua),
    isMobile: detectMobile(ua),
    browser: detectBrowser(ua),
    memory: nav.deviceMemory || null,
    cpuCores: navigator.hardwareConcurrency || null,
    screen: {
      w: screen.width,
      h: screen.height,
      dpr: window.devicePixelRatio || 1,
    },
    connection: nav.connection?.effectiveType || null,
  };
}

function detectPlatform(ua: string): Platform {
  if (/iPhone|iPad|iPod/.test(ua)) return Platform.iOS;
  if (/Android/.test(ua)) return Platform.Android;
  if (/Mac/.test(ua)) return Platform.MacOS;
  if (/Win/.test(ua)) return Platform.Windows;
  if (/Linux/.test(ua)) return Platform.Linux;
  return Platform.Unknown;
}

function detectMobile(ua: string): boolean {
  return /iPhone|iPad|iPod|Android.*Mobile/.test(ua);
}

function detectBrowser(ua: string): Browser {
  if (/Firefox\//.test(ua)) return Browser.Firefox;
  if (/Edg\//.test(ua)) return Browser.Edge;
  if (/Chrome\//.test(ua)) return Browser.Chrome;
  if (/Safari\//.test(ua)) return Browser.Safari;
  if (/Opera|OPR\//.test(ua)) return Browser.Opera;
  return Browser.Unknown;
}
