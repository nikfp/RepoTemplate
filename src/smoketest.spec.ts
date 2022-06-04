import { describe, expect, it } from 'vitest';

describe('smokeTest', async () => {
	describe('test suite starts up', () => {
		it('runs a successful test', () => {
			expect(1).to.equal(1);
		});
	});
});
