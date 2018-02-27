import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import ContactSteps from '../../src/containers/ContactSteps';
import { Provider } from 'react-redux';
import { createMockStore, createMockNavState, testSnapshot } from '../../testUtils';
import Adapter from 'enzyme-adapter-react-16/build/index';
import * as navigation from '../../src/actions/navigation';
import { SELECT_MY_STEP_SCREEN } from '../../src/containers/SelectMyStepScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../src/containers/PersonSelectStepScreen';
import { STAGE_SCREEN } from '../../src/containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';
import { buildTrackingObj } from '../../src/utils/common';

const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
  auth: {
    personId: 123,
  },
};

const mockPerson = {
  first_name: 'ben',
  id: 1,
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactSteps isMe={false} person={mockPerson} navigation={createMockNavState()} />
    </Provider>
  );
});


describe('Navigation to steps screen', () => {
  Enzyme.configure({ adapter: new Adapter() });
  navigation.navigatePush = jest.fn();
  const handleSaveNewSteps = jest.fn();
  const handleSaveNewStage = jest.fn();

  const createComponent = (isCurrentUser, contactStage, contactAssignment = null) => {
    const screen = shallow(
      <ContactSteps
        isMe={isCurrentUser}
        person={mockPerson}
        contactStage={contactStage}
        contactAssignment={contactAssignment}
        navigation={createMockNavState()}
      />,
      { context: { store } },
    );

    let component = screen.dive().dive().dive().instance();
    component.handleSaveNewSteps = handleSaveNewSteps;
    component.handleSaveNewStage = handleSaveNewStage;
    return component;
  };

  it('navigates to select my steps', () => {
    let component = createComponent(true, 'forgiven');

    component.handleCreateStep();

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      SELECT_MY_STEP_SCREEN,
      { contactStage: 'forgiven', onSaveNewSteps: handleSaveNewSteps, enableBackButton: true }
    );
  });

  it('navigates to select my stage', () => {
    let component = createComponent(true, undefined);

    component.handleCreateStep();

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      STAGE_SCREEN,
      { onComplete: handleSaveNewStage,
        firstItem: undefined,
        contactId: mockPerson.id,
        section: 'people',
        subsection: 'self',
        enableBackButton: true,
        noNav: true,
      }
    );
  });

  it('navigates to person steps', () => {
    let component = createComponent(false, 'forgiven', { id: 333 });

    component.handleCreateStep();
    expect(navigation.navigatePush).toHaveBeenCalledWith(
      PERSON_SELECT_STEP_SCREEN,
      { contactName: mockPerson.first_name,
        contactId: mockPerson.id,
        contact: mockPerson,
        contactStage: 'forgiven',
        organization: undefined,
        onSaveNewSteps: handleSaveNewSteps,
        createStepTracking: buildTrackingObj('people : person : steps : create', 'people', 'person', 'steps'),
      },
    );
  });

  it('navigates to person stage', () => {
    let component = createComponent(false, undefined, { id: 333 });

    component.handleCreateStep();
    expect(navigation.navigatePush).toHaveBeenCalledWith(
      PERSON_STAGE_SCREEN,
      { onComplete: handleSaveNewStage,
        firstItem: undefined,
        name: mockPerson.first_name,
        contactId: mockPerson.id,
        contactAssignmentId: 333,
        section: 'people',
        subsection: 'person',
        noNav: true,
      },
    );
  });
});

