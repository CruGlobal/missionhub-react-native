import 'react-native';
import React from 'react';
import { renderShallow, testSnapshotShallow } from '../../testUtils';

import { ContactScreen, mapStateToProps } from '../../src/containers/ContactScreen';
import { contactAssignmentSelector, personSelector } from '../../src/selectors/people';
import { organizationSelector } from '../../src/selectors/organizations';
import * as navigation from '../../src/actions/navigation';
import { Alert } from 'react-native';

jest.mock('../../src/selectors/people');
jest.mock('../../src/selectors/organizations');

const dispatch = jest.fn((response) => Promise.resolve(response));
navigation.navigatePush = jest.fn();

const person = { id: '2', type: 'person', first_name: 'Test Fname' };
const contactAssignment = { id: 3, type: 'reverse_contact_assignment', pathway_stage_id: 5 };
const stage = { id: 5, type: 'pathway_stage' };
const organization = { id: 1, type: 'organization' };


describe('ContactScreen', () => {
  describe('mapStateToProps', () => {
    it('should provide the necessary props with a contactAssignment', () => {
      personSelector.mockReturnValue(person);
      contactAssignmentSelector.mockReturnValue(contactAssignment);
      organizationSelector.mockReturnValue({ ...organization, name: 'Org from org selector' });
      expect(mapStateToProps(
        {
          auth: {
            isJean: true,
            personId: 1,
          },
          stages: {
            stages: [ stage ],
            stagesObj: {
              5: stage,
            },
          },
          people: {},
          organizations: { all: [ organization ] },
        },
        {
          navigation: {
            state: {
              params: {
                person: {},
                organization: organization,
              },
            },
          },
        }
      )).toMatchSnapshot();
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
      expect(mapStateToProps(
        {
          auth: {
            isJean: true,
            personId: 1,
          },
          stages: {
            stages: [ stage ],
            stagesObj: {
              5: stage,
            },
          },
          people: {},
        },
        {
          navigation: {
            state: {
              params: {
                person: {},
                organization: organization,
              },
            },
          },
        }
      )).toMatchSnapshot();
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
      instance = renderShallow(
        <ContactScreen
          dispatch={dispatch}
          isJean={true}
          personIsCurrentUser={false}
          person={person}
          contactStage={stage}
          organization={organization}
        />
      ).instance();
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
});
