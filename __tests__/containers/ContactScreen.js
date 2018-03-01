import 'react-native';
import React from 'react';
import { testSnapshotShallow } from '../../testUtils';

import { ContactScreen, mapStateToProps } from '../../src/containers/ContactScreen';
import { contactAssignmentSelector, personSelector } from '../../src/selectors/people';
import * as navigation from '../../src/actions/navigation';

jest.mock('../../src/selectors/people');

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
    it('should provide the necessary props with a user', () => {
      personSelector.mockReturnValue({
        ...person,
        user: {
          pathway_stage_id: 5,
        },
      });
      contactAssignmentSelector.mockReturnValue(undefined);
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
});
