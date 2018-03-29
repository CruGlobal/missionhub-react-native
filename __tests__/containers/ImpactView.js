import 'react-native';
import React from 'react';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

import { ImpactView, mapStateToProps } from '../../src/containers/ImpactView';

const dispatch = jest.fn((response) => Promise.resolve(response));

const person = { id: '2', type: 'person', first_name: 'Test Fname' };
const myImpact = {
  id: 'me-2018',
  type: 'impact_report',
  steps_count: 10,
  receivers_count: 5,
  pathway_moved_count: 3,
};
const userImpact = {
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

describe('ImpactView', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props', () => {
      expect(mapStateToProps(
        {
          impact: {
            mine: myImpact,
            global: globalImpact,
          },
          auth: {
            user: person,
          },
        },
      )).toMatchSnapshot();
    });
  });
  describe('user impact', () => {
    it('renders empty state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          isContactScreen={false}
          user={person}
          userImpact={{
            ...myImpact,
            steps_count: 0,
            pathway_moved_count: 0,
          }}
          globalImpact={{
            ...globalImpact,
            steps_count: 0,
            pathway_moved_count: 0,
          }}
        />
      );
    });
    it('renders singular state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          isContactScreen={false}
          user={person}
          userImpact={{
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
        />
      );
    });
    it('renders plural state', () => {
      testSnapshotShallow(
        <ImpactView
          dispatch={dispatch}
          isContactScreen={false}
          user={person}
          userImpact={{
            ...myImpact,
          }}
          globalImpact={globalImpact}
        />
      );
    });
  });
  describe('contact impact', () => {
    it('renders empty state', () => {
      const component = renderShallow(
        <ImpactView
          dispatch={dispatch}
          isContactScreen={true}
          user={person}
          globalImpact={globalImpact}
        />
      );
      component.setState({
        contactImpact: {
          ...userImpact,
          steps_count: 0,
          pathway_moved_count: 0,
        },
      });
      expect(component).toMatchSnapshot();
    });
    it('renders singular state', () => {
      const component = renderShallow(
        <ImpactView
          dispatch={dispatch}
          isContactScreen={true}
          user={person}
          globalImpact={globalImpact}
        />
      );
      component.setState({
        contactImpact: {
          ...userImpact,
          steps_count: 1,
          receivers_count: 1,
          pathway_moved_count: 1,
        },
      });
      expect(component).toMatchSnapshot();
    });
    it('renders plural state', () => {
      const component = renderShallow(
        <ImpactView
          dispatch={dispatch}
          isContactScreen={true}
          user={person}
          globalImpact={globalImpact}
        />
      );
      component.setState({
        contactImpact: {
          ...userImpact,
        },
      });
      expect(component).toMatchSnapshot();
    });
  });
});
