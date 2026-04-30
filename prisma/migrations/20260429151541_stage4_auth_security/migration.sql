-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('HQ_ADMIN', 'PROVINCIAL_ADMIN', 'DISTRICT_OFFICER', 'STATION_OFFICER', 'DEVICE_CLIENT');

-- CreateEnum
CREATE TYPE "TukTukStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'IMPOUNDED');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('USER', 'DEVICE', 'SYSTEM');

-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliceStation" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PoliceStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT,
    "districtId" TEXT,
    "stationId" TEXT,
    "fullName" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingDevice" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "imei" TEXT,
    "simNumber" TEXT,
    "firmwareVersion" TEXT,
    "authTokenHash" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "installedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "lastAuthenticatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackingDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TukTuk" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT,
    "districtId" TEXT,
    "stationId" TEXT,
    "driverId" TEXT,
    "deviceId" TEXT,
    "registrationNumber" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT,
    "status" "TukTukStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TukTuk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT,
    "districtId" TEXT,
    "stationId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "badgeNumber" TEXT,
    "passwordHash" TEXT NOT NULL,
    "refreshTokenHash" TEXT,
    "role" "UserRole" NOT NULL,
    "phoneNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationPing" (
    "id" TEXT NOT NULL,
    "tukTukId" TEXT NOT NULL,
    "deviceId" TEXT,
    "provinceId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "stationId" TEXT,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "speedKph" DECIMAL(6,2),
    "heading" DECIMAL(6,2),
    "accuracyM" DECIMAL(6,2),
    "ignitionOn" BOOLEAN,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationPing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentLocation" (
    "id" TEXT NOT NULL,
    "tukTukId" TEXT NOT NULL,
    "deviceId" TEXT,
    "provinceId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "stationId" TEXT,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "speedKph" DECIMAL(6,2),
    "heading" DECIMAL(6,2),
    "accuracyM" DECIMAL(6,2),
    "ignitionOn" BOOLEAN,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "actorUserId" TEXT,
    "actorDeviceId" TEXT,
    "provinceId" TEXT,
    "districtId" TEXT,
    "stationId" TEXT,
    "action" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "entityId" TEXT,
    "httpMethod" TEXT,
    "requestPath" TEXT,
    "statusCode" INTEGER,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Province_code_key" ON "Province"("code");

-- CreateIndex
CREATE INDEX "Province_name_idx" ON "Province"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_code_key" ON "District"("code");

-- CreateIndex
CREATE INDEX "District_provinceId_idx" ON "District"("provinceId");

-- CreateIndex
CREATE INDEX "District_provinceId_name_idx" ON "District"("provinceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "District_provinceId_name_key" ON "District"("provinceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PoliceStation_code_key" ON "PoliceStation"("code");

-- CreateIndex
CREATE INDEX "PoliceStation_provinceId_districtId_idx" ON "PoliceStation"("provinceId", "districtId");

-- CreateIndex
CREATE INDEX "PoliceStation_districtId_idx" ON "PoliceStation"("districtId");

-- CreateIndex
CREATE INDEX "PoliceStation_name_idx" ON "PoliceStation"("name");

-- CreateIndex
CREATE INDEX "PoliceStation_isActive_idx" ON "PoliceStation"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PoliceStation_districtId_name_key" ON "PoliceStation"("districtId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_nationalId_key" ON "Driver"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON "Driver"("licenseNumber");

-- CreateIndex
CREATE INDEX "Driver_provinceId_districtId_idx" ON "Driver"("provinceId", "districtId");

-- CreateIndex
CREATE INDEX "Driver_stationId_idx" ON "Driver"("stationId");

-- CreateIndex
CREATE INDEX "Driver_fullName_idx" ON "Driver"("fullName");

-- CreateIndex
CREATE INDEX "Driver_isActive_idx" ON "Driver"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingDevice_serialNumber_key" ON "TrackingDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "TrackingDevice_status_idx" ON "TrackingDevice"("status");

-- CreateIndex
CREATE INDEX "TrackingDevice_lastSeenAt_idx" ON "TrackingDevice"("lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "TukTuk_deviceId_key" ON "TukTuk"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "TukTuk_registrationNumber_key" ON "TukTuk"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TukTuk_plateNumber_key" ON "TukTuk"("plateNumber");

-- CreateIndex
CREATE INDEX "TukTuk_provinceId_districtId_idx" ON "TukTuk"("provinceId", "districtId");

-- CreateIndex
CREATE INDEX "TukTuk_stationId_idx" ON "TukTuk"("stationId");

-- CreateIndex
CREATE INDEX "TukTuk_driverId_idx" ON "TukTuk"("driverId");

-- CreateIndex
CREATE INDEX "TukTuk_status_idx" ON "TukTuk"("status");

-- CreateIndex
CREATE INDEX "TukTuk_provinceId_districtId_stationId_status_idx" ON "TukTuk"("provinceId", "districtId", "stationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "User"("role", "isActive");

-- CreateIndex
CREATE INDEX "User_provinceId_districtId_idx" ON "User"("provinceId", "districtId");

-- CreateIndex
CREATE INDEX "User_stationId_idx" ON "User"("stationId");

-- CreateIndex
CREATE INDEX "LocationPing_tukTukId_recordedAt_idx" ON "LocationPing"("tukTukId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "LocationPing_deviceId_recordedAt_idx" ON "LocationPing"("deviceId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "LocationPing_provinceId_districtId_recordedAt_idx" ON "LocationPing"("provinceId", "districtId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "LocationPing_stationId_recordedAt_idx" ON "LocationPing"("stationId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "LocationPing_recordedAt_idx" ON "LocationPing"("recordedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "CurrentLocation_tukTukId_key" ON "CurrentLocation"("tukTukId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentLocation_deviceId_key" ON "CurrentLocation"("deviceId");

-- CreateIndex
CREATE INDEX "CurrentLocation_provinceId_districtId_idx" ON "CurrentLocation"("provinceId", "districtId");

-- CreateIndex
CREATE INDEX "CurrentLocation_stationId_idx" ON "CurrentLocation"("stationId");

-- CreateIndex
CREATE INDEX "CurrentLocation_recordedAt_idx" ON "CurrentLocation"("recordedAt" DESC);

-- CreateIndex
CREATE INDEX "CurrentLocation_provinceId_districtId_recordedAt_idx" ON "CurrentLocation"("provinceId", "districtId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_actorType_occurredAt_idx" ON "AuditLog"("actorType", "occurredAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_occurredAt_idx" ON "AuditLog"("actorUserId", "occurredAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_actorDeviceId_occurredAt_idx" ON "AuditLog"("actorDeviceId", "occurredAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_entityName_entityId_occurredAt_idx" ON "AuditLog"("entityName", "entityId", "occurredAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_provinceId_districtId_stationId_occurredAt_idx" ON "AuditLog"("provinceId", "districtId", "stationId", "occurredAt" DESC);

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceStation" ADD CONSTRAINT "PoliceStation_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceStation" ADD CONSTRAINT "PoliceStation_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TukTuk" ADD CONSTRAINT "TukTuk_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TukTuk" ADD CONSTRAINT "TukTuk_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TukTuk" ADD CONSTRAINT "TukTuk_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TukTuk" ADD CONSTRAINT "TukTuk_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TukTuk" ADD CONSTRAINT "TukTuk_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationPing" ADD CONSTRAINT "LocationPing_tukTukId_fkey" FOREIGN KEY ("tukTukId") REFERENCES "TukTuk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationPing" ADD CONSTRAINT "LocationPing_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationPing" ADD CONSTRAINT "LocationPing_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationPing" ADD CONSTRAINT "LocationPing_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationPing" ADD CONSTRAINT "LocationPing_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentLocation" ADD CONSTRAINT "CurrentLocation_tukTukId_fkey" FOREIGN KEY ("tukTukId") REFERENCES "TukTuk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentLocation" ADD CONSTRAINT "CurrentLocation_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentLocation" ADD CONSTRAINT "CurrentLocation_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentLocation" ADD CONSTRAINT "CurrentLocation_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentLocation" ADD CONSTRAINT "CurrentLocation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorDeviceId_fkey" FOREIGN KEY ("actorDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
