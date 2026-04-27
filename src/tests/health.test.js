import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

const mockCheckDatabaseHealth = vi.fn();

vi.mock('../config/prisma.js', () => ({
  default: {
    province: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
  },
  checkDatabaseHealth: mockCheckDatabaseHealth,
}));

describe('GET /api/v1/health', () => {
  beforeEach(() => {
    mockCheckDatabaseHealth.mockResolvedValue(undefined);
  });

  it('returns a healthy response payload', async () => {
    const { default: app } = await import('../app.js');
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.database).toBe('connected');
  });

  it('returns 503 when the database health check fails', async () => {
    mockCheckDatabaseHealth.mockRejectedValueOnce(new Error('db down'));

    const { default: app } = await import('../app.js');
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
  });
});
