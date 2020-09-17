import { localizedStageSelector } from '../stages';

const stage = {
  id: '1',
  name: 'Test',
  description: 'Test Stage',
  self_followup_description: 'My Test Stage',
  position: 0,
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
  it('should find a localized stage by matching current app base locale', () => {
    expect(localizedStageSelector(stage, 'en')).toMatchInlineSnapshot(`
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
