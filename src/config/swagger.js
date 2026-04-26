import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import yaml from 'js-yaml';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const openApiPath = path.resolve(currentDirectory, '../docs/openapi.yaml');

export const swaggerDocument = yaml.load(fs.readFileSync(openApiPath, 'utf8'));

