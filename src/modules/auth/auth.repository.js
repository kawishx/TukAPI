import prisma from '../../config/prisma.js';

export const findUserByEmail = async (email) =>
  prisma.user.findUnique({
    where: { email },
  });

export const findUserById = async (id) =>
  prisma.user.findUnique({
    where: { id },
  });

export const updateUserSession = async (userId, refreshTokenHash) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokenHash,
      lastLoginAt: new Date(),
    },
  });

export const rotateRefreshToken = async (userId, refreshTokenHash) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokenHash,
    },
  });

export const clearRefreshToken = async (userId) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokenHash: null,
    },
  });
