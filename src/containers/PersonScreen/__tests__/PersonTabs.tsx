import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { personTabs } from '../PersonTabs';

jest.mock('../PersonSteps', () => ({
  // @ts-ignore
  ...jest.requireActual('../PersonSteps'),
  PersonSteps: 'PersonSteps',
}));
jest.mock('../PersonNotes', () => ({
  // @ts-ignore
  ...jest.requireActual('../PersonNotes'),
  PersonNotes: 'PersonNotes',
}));
jest.mock('../PersonJourney', () => ({
  // @ts-ignore
  ...jest.requireActual('../PersonJourney'),
  PersonJourney: 'PersonJourney',
}));
jest.mock('../../ImpactTab/ImpactTab', () => ({
  // @ts-ignore
  ...jest.requireActual('../../ImpactTab/ImpactTab'),
  ImpactTab: 'ImpactTab',
}));

it('should show my tabs', () => {
  expect(personTabs({ isMe: true })).toMatchInlineSnapshot(`
    Array [
      Object {
        "component": [Function],
        "name": "Steps",
        "navigationAction": "nav/PERSON_STEPS",
      },
      Object {
        "component": [Function],
        "name": "Notes",
        "navigationAction": "nav/PERSON_NOTES",
      },
      Object {
        "component": [Function],
        "name": "Journey",
        "navigationAction": "nav/PERSON_JOURNEY",
      },
      Object {
        "component": [Function],
        "name": "Impact",
        "navigationAction": "nav/IMPACT_TAB",
      },
    ]
  `);
});

it('should show tabs for other people', () => {
  expect(personTabs({ isMe: false })).toMatchInlineSnapshot(`
    Array [
      Object {
        "component": [Function],
        "name": "Steps",
        "navigationAction": "nav/PERSON_STEPS",
      },
      Object {
        "component": [Function],
        "name": "Notes",
        "navigationAction": "nav/PERSON_NOTES",
      },
      Object {
        "component": [Function],
        "name": "Journey",
        "navigationAction": "nav/PERSON_JOURNEY",
      },
    ]
  `);
});

it('should render steps tab', () => {
  const FeedTab = personTabs({ isMe: true })[0].component;
  renderWithContext(<FeedTab />).snapshot();
});

it('should render notes tab', () => {
  const NotesTab = personTabs({ isMe: true })[1].component;
  renderWithContext(<NotesTab />).snapshot();
});

it('should render journey tab', () => {
  const JourneyTab = personTabs({ isMe: true })[2].component;
  renderWithContext(<JourneyTab />).snapshot();
});

it('should render impact tab', () => {
  const ImpactTab = personTabs({ isMe: true })[3].component;
  renderWithContext(<ImpactTab />).snapshot();
});
