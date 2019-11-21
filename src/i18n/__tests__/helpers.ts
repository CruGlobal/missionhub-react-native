import {
  createBaseLocaleAliases,
  mapOneSkyToResourceLanguages,
  aliasLanguages,
} from '../helpers';

describe('createBaseLocaleAliases', () => {
  it('should create base aliases and use the last when there are repeated bases', () => {
    expect(
      createBaseLocaleAliases({
        'es-419': { translation: {} },
        'en-US': { translation: {} },
        'en-CA': { translation: {} },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "en": "en-CA",
        "es": "es-419",
      }
    `);
  });
});

describe('mapOneSkyToResourceLanguages', () => {
  it('should flatten OneSky translations to remove extra `translations` key', () => {
    expect(
      mapOneSkyToResourceLanguages({
        'es-419': { translation: { test: 'Latin America' } },
        'en-US': { translation: { test: 'US' } },
        'en-CA': { translation: { test: 'Canada' } },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "en-CA": Object {
          "test": "Canada",
        },
        "en-US": Object {
          "test": "US",
        },
        "es-419": Object {
          "test": "Latin America",
        },
      }
    `);
  });
});

describe('aliasLanguages', () => {
  it("should clone language translations to aliases if alias doesn't yet exist", () => {
    expect(
      aliasLanguages(
        { fake: 'en-US', 'en-CA': 'en-US' },
        {
          'es-419': { test: 'Latin America' },
          'en-US': { test: 'US' },
          'en-CA': { test: 'Canada' },
        },
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "en-CA": Object {
          "test": "Canada",
        },
        "en-US": Object {
          "test": "US",
        },
        "es-419": Object {
          "test": "Latin America",
        },
        "fake": Object {
          "test": "US",
        },
      }
    `);
  });
});
