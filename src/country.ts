import * as ct from 'countries-and-timezones';
import langMap from './lang-map.json';
import weights from './weights.json';
import type { GeoSignals, CountryScore } from './types';

export function getCountryFromTimezone(tz: string): string | null {
  const tzData = ct.getTimezone(tz);
  return tzData?.countries?.[0] || null;
}

export function getCountryFromLang(lang: string): string | null {
  // Try exact match with region (e.g., "en-GB" → "GB")
  const region = lang.split('-')[1]?.toUpperCase();
  if (region && ct.getCountry(region)) return region;

  // Fallback: language code → country
  const base = lang.split('-')[0].toLowerCase();
  return (langMap as Record<string, string>)[base] || null;
}

export function calculateCountryScores(signals: GeoSignals): CountryScore[] {
  const scores: Record<string, { score: number; sources: string[] }> = {};

  const addScore = (country: string | null, score: number, source: string) => {
    if (!country) return;
    scores[country] ??= { score: 0, sources: [] };
    scores[country].score += score;
    scores[country].sources.push(source);
  };

  addScore(signals.timezoneCountry, weights.timezone, 'timezone');
  addScore(signals.languageCountry, weights.language, 'language');

  const isMasked = signals.isVPN || signals.isProxy || signals.isDatacenter;
  addScore(signals.ipCountry, isMasked ? weights.ipMasked : weights.ip, 'ip');

  for (const lang of signals.languages.slice(1, 4)) {
    const country = getCountryFromLang(lang);
    if (country && country !== signals.languageCountry) {
      addScore(country, weights.secondaryLang, `lang:${lang}`);
    }
  }

  // Normalize and sort
  const result = Object.entries(scores)
    .map(([code, { score, sources }]) => ({ code, probability: score, sources }))
    .sort((a, b) => b.probability - a.probability);

  const total = result.reduce((sum, c) => sum + c.probability, 0);
  if (total > 0) {
    for (const c of result) {
      c.probability = Math.round((c.probability / total) * 100) / 100;
    }
  }

  return result;
}
