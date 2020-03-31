import { insertName } from '../steps';

describe('insertName', () => {
  it('should insert name', () => {
    expect(insertName('blah <<name>> blah blah', 'roge')).toEqual(
      'blah roge blah blah',
    );
  });
  it('should insert name multiple times', () => {
    expect(insertName('<<name>> <<name>> <<name>> <<name>>', 'roge')).toEqual(
      'roge roge roge roge',
    );
  });
});
