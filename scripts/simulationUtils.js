import fs from 'node:fs/promises';
import path from 'node:path';

export const DEFAULT_SIMULATION_SEED = 'stage7-demo';
export const DEFAULT_OPERATIONAL_COUNT = 200;
export const DEFAULT_SIMULATION_DAYS = 7;
export const DEFAULT_EXPORT_DIR = 'exports/simulation';

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const parseBoolean = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  if (normalized === 'true') {
    return true;
  }

  if (normalized === 'false') {
    return false;
  }

  return fallback;
};

export const normalizeDemoDate = (value = new Date().toISOString().slice(0, 10)) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`);
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid SIM_DEMO_DATE value: ${value}`);
  }

  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
};

export const getSimulationConfig = () => ({
  seed: process.env.SIM_SEED ?? DEFAULT_SIMULATION_SEED,
  operationalCount: parsePositiveInteger(process.env.SIM_TUK_TUK_COUNT, DEFAULT_OPERATIONAL_COUNT),
  days: parsePositiveInteger(process.env.SIM_DAYS, DEFAULT_SIMULATION_DAYS),
  demoDate: normalizeDemoDate(process.env.SIM_DEMO_DATE),
  exportDir: path.resolve(process.cwd(), process.env.SIM_EXPORT_DIR ?? DEFAULT_EXPORT_DIR),
  resetHistory: parseBoolean(process.env.SIM_RESET_HISTORY, true),
});

const xmur3 = (input) => {
  let hash = 1779033703 ^ input.length;

  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
};

const mulberry32 = (seed) => () => {
  let value = (seed += 0x6d2b79f5);
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

export const createSeededRandom = (seed) => {
  const seedFactory = xmur3(String(seed));
  return mulberry32(seedFactory());
};

export const randomBetween = (random, min, max) => min + (max - min) * random();
export const randomInteger = (random, min, max) => Math.floor(randomBetween(random, min, max + 1));
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
export const chunkArray = (items, size) =>
  items.reduce((chunks, item, index) => {
    if (index % size === 0) {
      chunks.push([]);
    }

    chunks[chunks.length - 1].push(item);
    return chunks;
  }, []);

export const addDaysUtc = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

export const setUtcTime = (date, hours, minutes = 0) => {
  const next = new Date(date);
  next.setUTCHours(hours, minutes, 0, 0);
  return next;
};

export const formatDateOnly = (date) => date.toISOString().slice(0, 10);

export const ensureDirectory = async (directoryPath) => {
  await fs.mkdir(directoryPath, { recursive: true });
};

export const writeJson = async (filePath, data) => {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const serialized = String(value);

  if (!serialized.includes(',') && !serialized.includes('"') && !serialized.includes('\n')) {
    return serialized;
  }

  return `"${serialized.replaceAll('"', '""')}"`;
};

export const writeCsv = async (filePath, rows) => {
  const normalizedRows = rows ?? [];
  const headers = normalizedRows.length > 0 ? Object.keys(normalizedRows[0]) : [];
  const lines = headers.length > 0
    ? [
        headers.join(','),
        ...normalizedRows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
      ]
    : [];

  await fs.writeFile(filePath, `${lines.join('\n')}\n`, 'utf8');
};
