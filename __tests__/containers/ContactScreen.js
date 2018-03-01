import 'react-native';
import React from 'react';
import { createMockStore, testSnapshotShallow } from '../../testUtils';

import { Provider } from 'react-redux';
import { ContactScreen, mapStateToProps } from '../../src/containers/ContactScreen';
import { contactAssignmentSelector, personSelector } from '../../src/selectors/people';
import Adapter from 'enzyme-adapter-react-16/build/index';
import Enzyme, { mount } from 'enzyme/build/index';
import * as navigation from '../../src/actions/navigation';
import { STAGE_SCREEN } from '../../src/containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';
jest.mock('../../src/selectors/people');

const dispatch = jest.fn((response) => Promise.resolve(response));
navigation.navigatePush = jest.fn();

const me = { id: '1', type: 'person', first_name: 'Test Fname' };
const person = { id: '2', type: 'person', first_name: 'Test Fname' };
const contactAssignment = { id: 3, type: 'reverse_contact_assignment', pathway_stage_id: 5 };
const stage = { id: 5, type: 'pathway_stage' };
const organization = { id: 1, type: 'organization' };

const mockstate = {
  auth: {
    isJean: true,
    personId: me.id,
  },
  stages: {
    stages: [ stage ],
    stagesObj: {
      5: stage,
    },
  },
  people: {},
};

const store = createMockStore(mockstate);


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
  describe('handleChangeStage', () => {
    const createComponent = (contact) => {
      Enzyme.configure({ adapter: new Adapter() });
      const screen = mount(
        <Provider store={store}>
          <ContactScreen
            dispatch={dispatch}
            isJean={true}
            personIsCurrentUser={true}
            person={contact}
            contactStage={stage}
          />
        </Provider>
      );
      return screen.instance();
    };

    it('Navigates to my stage screen', () => {
      personSelector.mockReturnValue(me);
      contactAssignmentSelector.mockReturnValue(contactAssignment);

      let component = createComponent(me);
      console.log(component.props);
      component.handleChangeStage();

      expect(navigation.navigatePush).toHaveBeenCalledWith(
        STAGE_SCREEN, {
          onComplete: expect.any(Function),
          firstItem: stage.id,
          contactId: me.id,
          section: 'people',
          subsection: 'self',
          enableBackButton: true,
          noNav: false,
        }
      );
    });
    it('Navigates to person stage screen', () => {
      personSelector.mockReturnValue(person);
      contactAssignmentSelector.mockReturnValue(contactAssignment);

      let component = createComponent(person);
      component.handleChangeStage();

      expect(navigation.navigatePush).toHaveBeenCalledWith(
        PERSON_STAGE_SCREEN, {
          onComplete: expect.any(Function),
          firstItem: 5,
          name: person.first_name,
          contactId: person.id,
          contactAssignmentId: contactAssignment.id,
          section: 'people',
          subsection: 'person',
          noNav: false,
        }
      );
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
