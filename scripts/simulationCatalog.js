import { USER_ROLES } from '../src/utils/constants.js';
import { createSeededRandom, randomInteger } from './simulationUtils.js';

export const provinces = [
  { code: 'WP', name: 'Western Province' },
  { code: 'CP', name: 'Central Province' },
  { code: 'SP', name: 'Southern Province' },
  { code: 'NP', name: 'Northern Province' },
  { code: 'EP', name: 'Eastern Province' },
  { code: 'NWP', name: 'North Western Province' },
  { code: 'NCP', name: 'North Central Province' },
  { code: 'UVA', name: 'Uva Province' },
  { code: 'SAB', name: 'Sabaragamuwa Province' },
];

export const districts = [
  { code: 'COL', name: 'Colombo', provinceCode: 'WP' },
  { code: 'GAM', name: 'Gampaha', provinceCode: 'WP' },
  { code: 'KAL', name: 'Kalutara', provinceCode: 'WP' },
  { code: 'KAN', name: 'Kandy', provinceCode: 'CP' },
  { code: 'MAT', name: 'Matale', provinceCode: 'CP' },
  { code: 'NUW', name: 'Nuwara Eliya', provinceCode: 'CP' },
  { code: 'GAL', name: 'Galle', provinceCode: 'SP' },
  { code: 'MATR', name: 'Matara', provinceCode: 'SP' },
  { code: 'HAM', name: 'Hambantota', provinceCode: 'SP' },
  { code: 'JAF', name: 'Jaffna', provinceCode: 'NP' },
  { code: 'KIL', name: 'Kilinochchi', provinceCode: 'NP' },
  { code: 'MAN', name: 'Mannar', provinceCode: 'NP' },
  { code: 'MUL', name: 'Mullaitivu', provinceCode: 'NP' },
  { code: 'VAV', name: 'Vavuniya', provinceCode: 'NP' },
  { code: 'TRI', name: 'Trincomalee', provinceCode: 'EP' },
  { code: 'BAT', name: 'Batticaloa', provinceCode: 'EP' },
  { code: 'AMP', name: 'Ampara', provinceCode: 'EP' },
  { code: 'KUR', name: 'Kurunegala', provinceCode: 'NWP' },
  { code: 'PUT', name: 'Puttalam', provinceCode: 'NWP' },
  { code: 'ANU', name: 'Anuradhapura', provinceCode: 'NCP' },
  { code: 'POL', name: 'Polonnaruwa', provinceCode: 'NCP' },
  { code: 'BAD', name: 'Badulla', provinceCode: 'UVA' },
  { code: 'MON', name: 'Monaragala', provinceCode: 'UVA' },
  { code: 'RAT', name: 'Ratnapura', provinceCode: 'SAB' },
  { code: 'KEG', name: 'Kegalle', provinceCode: 'SAB' },
];

export const stations = [
  { code: 'FORT', name: 'Fort Police Station', districtCode: 'COL', address: 'Colombo 01', contactNumber: '+94112345601', latitude: 6.9344, longitude: 79.8428 },
  { code: 'PET', name: 'Pettah Police Station', districtCode: 'COL', address: 'Pettah, Colombo', contactNumber: '+94112345602', latitude: 6.9391, longitude: 79.8506 },
  { code: 'MNTL', name: 'Mount Lavinia Police Station', districtCode: 'COL', address: 'Mount Lavinia', contactNumber: '+94112345603', latitude: 6.8389, longitude: 79.863 },
  { code: 'NEG', name: 'Negombo Police Station', districtCode: 'GAM', address: 'Negombo', contactNumber: '+94312234501', latitude: 7.2083, longitude: 79.8358 },
  { code: 'KEL', name: 'Kelaniya Police Station', districtCode: 'GAM', address: 'Kelaniya', contactNumber: '+94112345604', latitude: 6.9553, longitude: 79.922 },
  { code: 'PAN', name: 'Panadura Police Station', districtCode: 'KAL', address: 'Panadura', contactNumber: '+94382234501', latitude: 6.7132, longitude: 79.9066 },
  { code: 'KDY', name: 'Kandy HQ Police Station', districtCode: 'KAN', address: 'Kandy', contactNumber: '+94812234501', latitude: 7.2906, longitude: 80.6337 },
  { code: 'PER', name: 'Peradeniya Police Station', districtCode: 'KAN', address: 'Peradeniya', contactNumber: '+94812234502', latitude: 7.2664, longitude: 80.594 },
  { code: 'NUWPS', name: 'Nuwara Eliya Police Station', districtCode: 'NUW', address: 'Nuwara Eliya', contactNumber: '+94522234501', latitude: 6.9497, longitude: 80.7891 },
  { code: 'GALP', name: 'Galle Police Station', districtCode: 'GAL', address: 'Galle Fort', contactNumber: '+94912234501', latitude: 6.0329, longitude: 80.2168 },
  { code: 'MATP', name: 'Matara Police Station', districtCode: 'MATR', address: 'Matara', contactNumber: '+94412234501', latitude: 5.9549, longitude: 80.555 },
  { code: 'HAMB', name: 'Hambantota Police Station', districtCode: 'HAM', address: 'Hambantota', contactNumber: '+94472234501', latitude: 6.1241, longitude: 81.1185 },
  { code: 'JAFP', name: 'Jaffna Police Station', districtCode: 'JAF', address: 'Jaffna Town', contactNumber: '+94212234501', latitude: 9.6615, longitude: 80.0255 },
  { code: 'TRIP', name: 'Trincomalee Police Station', districtCode: 'TRI', address: 'Trincomalee', contactNumber: '+94262234501', latitude: 8.5874, longitude: 81.2152 },
  { code: 'BATP', name: 'Batticaloa Police Station', districtCode: 'BAT', address: 'Batticaloa', contactNumber: '+94652234501', latitude: 7.7102, longitude: 81.6924 },
  { code: 'AMPP', name: 'Ampara Police Station', districtCode: 'AMP', address: 'Ampara', contactNumber: '+94632234501', latitude: 7.2915, longitude: 81.6724 },
  { code: 'KURP', name: 'Kurunegala Police Station', districtCode: 'KUR', address: 'Kurunegala', contactNumber: '+94372234501', latitude: 7.4863, longitude: 80.3647 },
  { code: 'PUTP', name: 'Puttalam Police Station', districtCode: 'PUT', address: 'Puttalam', contactNumber: '+94322234501', latitude: 8.0362, longitude: 79.8283 },
  { code: 'ANUP', name: 'Anuradhapura Police Station', districtCode: 'ANU', address: 'Anuradhapura', contactNumber: '+94252234501', latitude: 8.3114, longitude: 80.4037 },
  { code: 'POLP', name: 'Polonnaruwa Police Station', districtCode: 'POL', address: 'Polonnaruwa', contactNumber: '+94272234501', latitude: 7.9403, longitude: 81.0188 },
  { code: 'BADP', name: 'Badulla Police Station', districtCode: 'BAD', address: 'Badulla', contactNumber: '+94552234501', latitude: 6.9934, longitude: 81.055 },
  { code: 'MONP', name: 'Monaragala Police Station', districtCode: 'MON', address: 'Monaragala', contactNumber: '+94552234502', latitude: 6.8728, longitude: 81.3507 },
  { code: 'RATP', name: 'Ratnapura Police Station', districtCode: 'RAT', address: 'Ratnapura', contactNumber: '+94452234501', latitude: 6.6828, longitude: 80.3992 },
  { code: 'KEGP', name: 'Kegalle Police Station', districtCode: 'KEG', address: 'Kegalle', contactNumber: '+94352234501', latitude: 7.2511, longitude: 80.3464 },
];

export const demoUsers = [
  {
    fullName: 'HQ Administrator',
    email: 'hq.admin@demo.local',
    badgeNumber: 'HQ-001',
    role: USER_ROLES.HQ_ADMIN,
  },
  {
    fullName: 'Western Provincial Admin',
    email: 'western.admin@demo.local',
    badgeNumber: 'PV-WP-001',
    role: USER_ROLES.PROVINCIAL_ADMIN,
    provinceCode: 'WP',
  },
  {
    fullName: 'Southern Provincial Admin',
    email: 'southern.admin@demo.local',
    badgeNumber: 'PV-SP-001',
    role: USER_ROLES.PROVINCIAL_ADMIN,
    provinceCode: 'SP',
  },
  {
    fullName: 'Colombo District Officer',
    email: 'colombo.officer@demo.local',
    badgeNumber: 'DT-COL-001',
    role: USER_ROLES.DISTRICT_OFFICER,
    provinceCode: 'WP',
    districtCode: 'COL',
  },
  {
    fullName: 'Galle District Officer',
    email: 'galle.officer@demo.local',
    badgeNumber: 'DT-GAL-001',
    role: USER_ROLES.DISTRICT_OFFICER,
    provinceCode: 'SP',
    districtCode: 'GAL',
  },
  {
    fullName: 'Fort Station Officer',
    email: 'fort.officer@demo.local',
    badgeNumber: 'ST-FORT-001',
    role: USER_ROLES.STATION_OFFICER,
    provinceCode: 'WP',
    districtCode: 'COL',
    stationCode: 'FORT',
  },
  {
    fullName: 'Kandy Station Officer',
    email: 'kandy.officer@demo.local',
    badgeNumber: 'ST-KDY-001',
    role: USER_ROLES.STATION_OFFICER,
    provinceCode: 'CP',
    districtCode: 'KAN',
    stationCode: 'KDY',
  },
];

const firstNames = [
  'Kasun', 'Nimal', 'Amila', 'Sajith', 'Pradeep', 'Hirusha', 'Janaka', 'Rashan', 'Dilan', 'Mahesh',
  'Ravindu', 'Tharindu', 'Niroshan', 'Ashan', 'Chamath', 'Lahiru', 'Udesh', 'Roshan', 'Sampath', 'Yomal',
  'Dilshan', 'Hasitha', 'Kushan', 'Madushan', 'Nadeera',
];

const lastNames = [
  'Perera', 'Silva', 'Fernando', 'Jayasekara', 'Kumar', 'Mendis', 'Dissanayake', 'Gunasekara', 'Wijesinghe', 'Rajapaksha',
  'Karunaratne', 'Bandara', 'Abeykoon', 'Senanayake', 'Maduranga', 'Rathnayake', 'Herath', 'Wijeratne', 'Peiris', 'Gamage',
  'Hettiarachchi', 'Pathirana', 'Ilangakoon', 'Weerasinghe', 'Kulathunga',
];

const tukTukModels = ['Bajaj RE', 'Piaggio Ape', 'TVS King'];
const tukTukColors = ['Green', 'Yellow', 'Blue', 'Red', 'Black', 'White', 'Silver'];

const districtByCode = new Map(districts.map((district) => [district.code, district]));

export const stationByCode = new Map(stations.map((station) => [station.code, station]));

export const buildOperationalSeeds = ({ count = 200, seed = 'stage7-demo' } = {}) => {
  const random = createSeededRandom(seed);
  const driverSeeds = [];
  const deviceSeeds = [];
  const tukTukSeeds = [];

  for (let index = 0; index < count; index += 1) {
    const station = stations[index % stations.length];
    const district = districtByCode.get(station.districtCode);
    const provinceCode = district.provinceCode;
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
    const suffix = String(index + 1).padStart(3, '0');
    const registrationNumber = `REG-2026-${String(index + 1).padStart(6, '0')}`;
    const plateNumber = `${provinceCode}-CAB-${String(5001 + index).padStart(4, '0')}`;
    const deviceSerial = `SIM-TD-${suffix}`;

    driverSeeds.push({
      stationCode: station.code,
      fullName: `${firstName} ${lastName}`,
      nationalId: `${1985 + (index % 20)}${String(10000000 + index).padStart(8, '0')}`,
      licenseNumber: `B${String(7000000 + index).padStart(7, '0')}`,
      phoneNumber: `+9477${String(200000 + index).padStart(6, '0')}`,
      address: `${station.address}, ${district.name}`,
      isActive: true,
    });

    deviceSeeds.push({
      serialNumber: deviceSerial,
      imei: `359881${String(100000000 + index).padStart(9, '0')}`,
      simNumber: `+9476${String(300000 + index).padStart(6, '0')}`,
      firmwareVersion: `v1.0.${(index % 5) + 1}`,
      authToken: `demo-device-token-${suffix}`,
      status: 'ACTIVE',
    });

    tukTukSeeds.push({
      stationCode: station.code,
      driverLicense: `B${String(7000000 + index).padStart(7, '0')}`,
      deviceSerial,
      registrationNumber,
      plateNumber,
      model: tukTukModels[index % tukTukModels.length],
      color: tukTukColors[randomInteger(random, 0, tukTukColors.length - 1)],
      status: 'ACTIVE',
      notes: `Simulation fleet vehicle ${suffix} assigned to ${station.name}.`,
    });
  }

  return {
    driverSeeds,
    deviceSeeds,
    tukTukSeeds,
  };
};
