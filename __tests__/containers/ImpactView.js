import 'react-native';
import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import { ImpactView, mapStateToProps } from '../../src/containers/ImpactView';

const dispatch = jest.fn(response => Promise.resolve(response));

const me = { id: '1', type: 'person', first_name: 'ME' };
const person = { id: '2', type: 'person', first_name: 'Test Fname' };
const myImpact = {
  id: 'me-2018',
  type: 'impact_report',
  steps_count: 10,
  receivers_count: 5,
  pathway_moved_count: 3,
};
const personImpact = {
  id: '1-2018',
  type: 'impact_report',
  steps_count: 11,
  receivers_count: 6,
  pathway_moved_count: 4,
};
const globalImpact = {
  id: 'global-2018',
  type: 'impact_report',
  steps_count: 10,
  receivers_count: 5,
  step_owners_count: 200,
  pathway_moved_count: 50,
};
const personInteractions = {
  P1W: [
    {
      id: '100',
      requestFieldName: 'contact_count',
      iconName: 'peopleIcon',
      translationKey: 'interactionAssignedContacts',
      num: 1,
    },
    {
      id: '101',
      requestFieldName: 'uncontacted_count',
      iconName: 'uncontactedIcon',
      translationKey: 'interactionUncontacted',
      num: 0,
    },
    {
      id: '2',
      iconName: 'spiritualConversationIcon',
      translationKey: 'interactionSpiritualConversation',
      isOnAction: true,
      tracking: 'cru.initiatinggospelconversations',
      num: 0,
    },
    {
      id: '3',
      iconName: 'gospelIcon',
      translationKey: 'interactionGospel',
      isOnAction: true,
      tracking: 'cru.presentingthegospel',
      num: 0,
    },
    {
      id: '4',
      iconName: 'decisionIcon',
      translationKey: 'interactionDecision',
      isOnAction: true,
      tracking: 'cru.newprofessingbelievers',
      num: 0,
    },
    {
      id: '5',
      iconName: 'spiritIcon',
      translationKey: 'interactionSpirit',
      isOnAction: true,
      tracking: 'cru.presentingtheholyspirit',
      num: 0,
    },
    {
      id: '9',
      iconName: 'discipleshipConversationIcon',
      translationKey: 'interactionDiscipleshipConversation',
      isOnAction: true,
      tracking: 'cru.discipleshipconversation',
      num: 0,
    },
  ],
};
const organization = { id: '34', _type: 'organization', name: 'Test Org' };

describe('ImpactView', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props when viewing ME person', () => {
      expect(
        mapStateToProps(
          {
            impact: {
              summary: {
                [`${me.id}-`]: myImpact,
                '-': globalImpact,
              },
              interactions: {
                [`${me.id}-`]: personInteractions,
              },
            },
            auth: {
              person: me,
            },
          },
          {
            person: me,
          },
        ),
      ).toMatchSnapshot();
    });
    it('should provide the necessary props when not viewing ME person', () => {
      expect(
        mapStateToProps(
          {
            impact: {
              summary: {
                [`${person.id}-`]: personImpact,
                '-': globalImpact,
              },
              interactions: {
                [`${person.id}-${organization.id}`]: personInteractions,
              },
            },
            auth: {
              person,
            },
          },
          {
            person,
            organization,
          },
        ),
      ).toMatchSnapshot();
    });
  });
  describe('ME person impact view', () => {
    it('renders empty state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          person={me}
          isMe={true}
          isPersonalMinistryMe={true}
          impact={{
            ...myImpact,
            steps_count: 0,
            pathway_moved_count: 0,
          }}
          globalImpact={{
            ...globalImpact,
            steps_count: 0,
            pathway_moved_count: 0,
          }}
        />,
      );
    });
    it('renders singular state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          person={me}
          isMe={true}
          isPersonalMinistryMe={true}
          impact={{
            ...myImpact,
            steps_count: 1,
            receivers_count: 1,
            pathway_moved_count: 1,
          }}
          globalImpact={{
            ...globalImpact,
            steps_count: 1,
            receivers_count: 1,
            pathway_moved_count: 1,
          }}
        />,
      );
    });
    it('renders plural state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          person={me}
          isMe={true}
          isPersonalMinistryMe={true}
          impact={myImpact}
          globalImpact={globalImpact}
        />,
      );
    });
  });
  describe('contact impact', () => {
    it('renders empty state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          person={person}
          impact={{
            ...personImpact,
            steps_count: 0,
            pathway_moved_count: 0,
          }}
          interactions={personInteractions}
        />,
      );
    });
    it('renders singular state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          person={person}
          impact={{
            ...personImpact,
            steps_count: 1,
            receivers_count: 1,
            pathway_moved_count: 1,
          }}
          interactions={personInteractions}
        />,
      );
    });
    it('renders plural state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          person={person}
          impact={personImpact}
          interactions={personInteractions}
        />,
      );
    });
  });
  describe('group impact', () => {
    it('renders empty state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          organization={organization}
          impact={{
            ...personImpact,
            steps_count: 0,
            pathway_moved_count: 0,
          }}
          interactions={personInteractions}
        />,
      );
    });
    it('renders singular state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          organization={organization}
          impact={{
            ...personImpact,
            steps_count: 1,
            receivers_count: 1,
            pathway_moved_count: 1,
          }}
          interactions={personInteractions}
        />,
      );
    });
    it('renders plural state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          organization={organization}
          impact={personImpact}
          interactions={personInteractions}
        />,
      );
    });
  });
});
