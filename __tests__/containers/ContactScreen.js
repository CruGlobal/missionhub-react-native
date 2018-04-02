import 'react-native';
import React from 'react';
import { renderShallow, testSnapshotShallow } from '../../testUtils';

import { ContactScreen, mapStateToProps } from '../../src/containers/ContactScreen';
import { STAGE_SCREEN } from '../../src/containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';
import { contactAssignmentSelector, personSelector, orgPermissionSelector } from '../../src/selectors/people';
import { organizationSelector } from '../../src/selectors/organizations';
import * as navigation from '../../src/actions/navigation';
import * as journey from '../../src/actions/journey';
import * as impact from '../../src/actions/impact';
import { Alert } from 'react-native';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

jest.mock('../../src/selectors/people');
jest.mock('../../src/selectors/organizations');
jest.mock('../../src/actions/api');

const person = { id: '2', type: 'person', first_name: 'Test Fname' };
const contactAssignment = { id: 3, type: 'reverse_contact_assignment', pathway_stage_id: 5 };
const stage = { id: 5, type: 'pathway_stage' };
const stages = [ stage ];
const organization = { id: 1, type: 'organization' };
const orgPermission = { id: '6', _type: 'organizational_permission', permission_id: 2 };

const dispatch = jest.fn((response) => Promise.resolve(response));
navigation.navigatePush = jest.fn((screenName, params) => {
  if (screenName === PERSON_STAGE_SCREEN && params.onComplete) {
    params.onComplete(stage);
    return { type: 'nav to select stage' };
  }
});

const state = {
  auth: {
    isJean: true,
    personId: 1,
  },
  stages: {
    stages,
    stagesObj: {
      5: stage,
    },
  },
  people: {},
  organizations: { all: [ organization ] },
};
const props = {
  navigation: {
    state: {
      params: {
        person,
        organization,
      },
    },
  },
};

let store;
let component;

const createMockStore = () => {
  return configureStore([ thunk ])(state);
};

const createComponent = () => {
  return renderShallow(
    <ContactScreen
      dispatch={dispatch}
      isJean={true}
      personIsCurrentUser={false}
      person={person}
      contactStage={stage}
      organization={organization}
      stages={stages}
    />,
    store
  );
};


describe('ContactScreen', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props with a contactAssignment', () => {
      personSelector.mockReturnValue(person);
      contactAssignmentSelector.mockReturnValue(contactAssignment);
      organizationSelector.mockReturnValue({ ...organization, name: 'Org from org selector' });
      orgPermissionSelector.mockReturnValue(orgPermission);

      expect(mapStateToProps(state, props)).toMatchSnapshot();
      expect(personSelector).toHaveBeenCalledWith({ people: state.people }, { personId: person.id, orgId: organization.id });
      expect(contactAssignmentSelector).toHaveBeenCalledWith({ auth: state.auth }, { person, orgId: organization.id });
      expect(organizationSelector).toHaveBeenCalledWith({ organizations: state.organizations }, { orgId: organization.id });
      expect(orgPermissionSelector).toHaveBeenCalledWith(null, { person, organization });
    });
    it('should provide the necessary props with a user', () => {
      personSelector.mockReturnValue({
        ...person,
        user: {
          pathway_stage_id: 5,
        },
      });
      contactAssignmentSelector.mockReturnValue(undefined);
      organizationSelector.mockReturnValue(organization);
      orgPermissionSelector.mockReturnValue(orgPermission);
      expect(mapStateToProps(state, props)).toMatchSnapshot();
      expect(personSelector).toHaveBeenCalledWith({ people: state.people }, { personId: person.id, orgId: organization.id });
      expect(contactAssignmentSelector).toHaveBeenCalledWith({ auth: state.auth }, { person, orgId: organization.id });
      expect(organizationSelector).toHaveBeenCalledWith({ organizations: state.organizations }, { orgId: organization.id });
      expect(orgPermissionSelector).toHaveBeenCalledWith(null, { person, organization });
    });
  });
  it('renders correctly as Casey', () => {
    testSnapshotShallow(
      <ContactScreen
        dispatch={dispatch}
        isJean={false}
        personIsCurrentUser={false}
        person={person}
        contactStage={stage}
      />
    );
  });
  it('renders correctly as Jean', () => {
    testSnapshotShallow(
      <ContactScreen
        dispatch={dispatch}
        isJean={true}
        personIsCurrentUser={false}
        person={person}
        contactStage={stage}
        organization={organization}
      />
    );
  });

  describe('promptToAssign', () => {
    let instance;

    beforeEach(() => {
      store = createMockStore();
      instance = createComponent().instance();
      Alert.alert = jest.fn();
    });

    it('should not show an alert if current user', async() => {
      await instance.promptToAssign(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });
    it('should not show an alert if there is a contact assignment', async() => {
      await instance.promptToAssign(false, { _type: 'contact_assignment' });
      expect(Alert.alert).not.toHaveBeenCalled();
    });
    describe('when showing alert if there is a contact assignment', () => {
      let promptPromise;
      beforeEach(() => {
        promptPromise = instance.promptToAssign(false, false);
        expect(Alert.alert).toHaveBeenCalledTimes(1);
      });

      it('should reject promise on cancel', async() => {
        //Manually call cancel onPress
        Alert.alert.mock.calls[0][2][0].onPress();
        expect(await promptPromise).toEqual(false);
      });

      it('should reject promise on dismiss', async() => {
        //Manually call onDismiss
        Alert.alert.mock.calls[0][3].onDismiss();
        expect(await promptPromise).toEqual(false);
      });

      it('should create contact assignment if assign is pressed', async() => {
        //Manually call assign onPress
        Alert.alert.mock.calls[0][2][1].onPress();
        expect(await promptPromise).toEqual(true);
      });
    });
  });

  describe('handleChangeStage', () => {
    journey.reloadJourney = jest.fn();
    impact.getMyImpact = jest.fn();

    beforeEach(() => {
      store = createMockStore();
      component = createComponent();

      component.instance().promptToAssign = jest.fn(() => true );
    });

    it('updates person stage', async() => {
      await component.instance().handleChangeStage();

      expect(navigation.navigatePush).toHaveBeenCalled();
      expect(journey.reloadJourney).toHaveBeenCalledWith(person.id, organization.id);
      expect(impact.getMyImpact).toHaveBeenCalled();
    });
  });
});
