import { PrismaClient } from '@prisma/client';
import { vi } from 'vitest';

import prisma from '../lib/providers/database';

vi.mock('../lib/providers/database', () => ({
	default: new PrismaClient({
		datasources: {
			db: {
				url: 'file:./dev_test.db'
			}
		}
	}),
	__esModule: true
}));

export const prismaMock = prisma;
