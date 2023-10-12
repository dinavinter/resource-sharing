import { examples } from './ts';

describe('ts', () => {
  it('should work', () => {
    expect(new examples().orgs).toBeTruthy();
  });
});
