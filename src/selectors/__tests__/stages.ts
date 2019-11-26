import { stageSelector, localizedStageSelector } from '../stages';

const stage = {
  id: '1',
  name: 'Test',
  description: 'Test Stage',
  self_followup_description: 'My Test Stage',
  position: 0,
  name_i18n: '',
  description_i18n: '',
  icon_url: '',
  localized_pathway_stages: [
    {
      locale: 'en-TEST',
      name: 'English Test',
      description: 'English Description',
      self_followup_description: 'My English Description',
    },
  ],
};

describe('stageSelector', () => {
  it('should find a stage by id', () => {
    expect(
      stageSelector(
        {
          stages: {
            stages: [stage],
          },
        },
        {
          stageId: '1',
        },
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "description": "Test Stage",
        "description_i18n": "",
        "icon_url": "",
        "id": "1",
        "localized_pathway_stages": Array [
          Object {
            "description": "English Description",
            "locale": "en-TEST",
            "name": "English Test",
            "self_followup_description": "My English Description",
          },
        ],
        "name": "Test",
        "name_i18n": "",
        "position": 0,
        "self_followup_description": "My Test Stage",
      }
    `);
  });
  it('should return undefined when no stage is found', () => {
    expect(
      stageSelector(
        {
          stages: {
            stages: [stage],
          },
        },
        {
          stageId: '2',
        },
      ),
    ).toEqual(undefined);
  });
});

describe('localizedStageSelector', () => {
  it('should find a localized stage by current app locale', () => {
    expect(localizedStageSelector(stage, 'en-TEST')).toMatchInlineSnapshot(`
      Object {
        "description": "English Description",
        "locale": "en-TEST",
        "name": "English Test",
        "self_followup_description": "My English Description",
      }
    `);
  });
  it('should return the parent stage data if no locale matches', () => {
    expect(localizedStageSelector(stage, 'es-MX')).toMatchInlineSnapshot(`
      Object {
        "description": "Test Stage",
        "locale": "",
        "name": "Test",
        "self_followup_description": "My Test Stage",
      }
    `);
  });
});
