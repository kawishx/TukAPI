import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

vi.mock('../config/prisma.js', async () => {
  const mockModule = await import('./helpers/mockPrisma.js');

  return {
    default: mockModule.mockPrisma,
    checkDatabaseHealth: mockModule.mockCheckDatabaseHealth,
  };
});

const [{ default: app }, mockModule, requestHelpers] = await Promise.all([
  import('../app.js'),
  import('./helpers/mockPrisma.js'),
  import('./helpers/requestBuilders.js'),
]);

const { resetMockData, getMockState } = mockModule;
const { asDevice, asUser } = requestHelpers;

describe('API integration', () => {
  beforeEach(async () => {
    await resetMockData();
  });

  it('auth login succeeds with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'hq.admin@demo.local',
        password: 'DemoPass123!',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeTypeOf('string');
    expect(response.body.data.refreshToken).toBeTypeOf('string');
    expect(response.body.data.user.email).toBe('hq.admin@demo.local');
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  it('auth login fails with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'hq.admin@demo.local',
        password: 'WrongPassword123!',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid credentials.');
  });

  it('rejects unauthorized access to a protected route', async () => {
    const response = await request(app).get('/api/v1/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('accepts a valid device ping and updates current location', async () => {
    const response = await asDevice(
      request(app).post('/api/v1/locations/pings'),
      'dev-1',
    ).send({
      tukTukId: 'ttk-col-1',
      deviceId: 'dev-1',
      provinceId: 'prv-wp',
      districtId: 'dst-col',
      stationId: 'stn-fort',
      latitude: 6.9352,
      longitude: 79.8441,
      speedKmh: 24.5,
      heading: 190.4,
      ignitionOn: true,
      recordedAt: '2026-04-29T09:00:00.000Z',
    });

    const currentLocation = getMockState().currentLocations.find((entry) => entry.tukTukId === 'ttk-col-1');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.speedKmh).toBe(24.5);
    expect(currentLocation.recordedAt.toISOString()).toBe('2026-04-29T09:00:00.000Z');
  });

  it('rejects a revoked device ping', async () => {
    const response = await asDevice(
      request(app).post('/api/v1/locations/pings'),
      'dev-2',
    ).send({
      tukTukId: 'ttk-col-1',
      deviceId: 'dev-2',
      provinceId: 'prv-wp',
      districtId: 'dst-col',
      stationId: 'stn-fort',
      latitude: 6.9352,
      longitude: 79.8441,
      speedKmh: 12.5,
      heading: 180.0,
      ignitionOn: true,
      recordedAt: '2026-04-29T09:05:00.000Z',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid device credentials.');
  });

  it('stores an older out-of-order ping historically without replacing CurrentLocation', async () => {
    const originalCurrentLocation = getMockState().currentLocations.find((entry) => entry.tukTukId === 'ttk-col-1');
    const originalPingCount = getMockState().locationPings.length;

    const response = await asDevice(
      request(app).post('/api/v1/locations/pings'),
      'dev-1',
    ).send({
      tukTukId: 'ttk-col-1',
      deviceId: 'dev-1',
      provinceId: 'prv-wp',
      districtId: 'dst-col',
      stationId: 'stn-fort',
      latitude: 6.9339,
      longitude: 79.8419,
      speedKmh: 8.5,
      heading: 120.0,
      ignitionOn: true,
      recordedAt: '2026-04-29T07:00:00.000Z',
    });

    const currentLocation = getMockState().currentLocations.find((entry) => entry.tukTukId === 'ttk-col-1');

    expect(response.status).toBe(201);
    expect(getMockState().locationPings).toHaveLength(originalPingCount + 1);
    expect(currentLocation.recordedAt.toISOString()).toBe(originalCurrentLocation.recordedAt.toISOString());
  });

  it('returns paginated live location data', async () => {
    const response = await asUser(
      request(app).get('/api/v1/locations/live?page=1&limit=1'),
      'hq.admin@demo.local',
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(1);
    expect(response.body.meta.totalItems).toBe(2);
    expect(response.body.meta.totalPages).toBe(2);
  });

  it('filters history by tuk-tuk and time window', async () => {
    const response = await asUser(
      request(app).get('/api/v1/locations/history?tukTukId=ttk-col-1&from=2026-04-29T07:30:00.000Z&to=2026-04-29T08:30:00.000Z'),
      'hq.admin@demo.local',
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].tukTukId).toBe('ttk-col-1');
    expect(response.body.meta.totalItems).toBe(1);
  });

  it('prevents a district-scoped user from accessing data outside their district', async () => {
    const response = await asUser(
      request(app).get('/api/v1/tuk-tuks/ttk-gam-1'),
      'colombo.officer@demo.local',
    );

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('returns 304 for live location requests when the ETag matches', async () => {
    const firstResponse = await asUser(
      request(app).get('/api/v1/locations/live/ttk-col-1'),
      'hq.admin@demo.local',
    );

    const secondResponse = await asUser(
      request(app)
        .get('/api/v1/locations/live/ttk-col-1')
        .set('If-None-Match', firstResponse.headers.etag),
      'hq.admin@demo.local',
    );

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.headers.etag).toBeTruthy();
    expect(secondResponse.status).toBe(304);
  });
});
