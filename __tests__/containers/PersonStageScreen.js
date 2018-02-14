import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

// Note: test renderer must be required after react-native.
import PersonStageScreen from '../../src/containers/PersonStageScreen';
import { testSnapshot, createMockNavState, createMockStore } from '../../testUtils';
import * as navigation from '../../src/actions/navigation';
import * as selectStage from '../../src/actions/selectStage';

const mockState = {
  personProfile: {
    personFirstName: 'Billy',
    personLastName: 'Test',
  },
  auth: {},
  notifications: {},
  stages: [],
};

const mockStage = {
  id: 1,
};

let store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PersonStageScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
          enableBackButton: true,
          section: 'section',
          subsection: 'subsection',
        })}
      />
    </Provider>
  );
});

describe('person stage screen methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <PersonStageScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
          section: 'section',
          subsection: 'subsection',
        })}
      />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('runs handle navigate', () => {
    
    navigation.navigatePush = jest.fn();

    component.handleNavigate();
    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

  it('runs select stage', () => {
    
    selectStage.updateUserStage = jest.fn();

    component.handleSelectStage(mockStage, false);
    expect(selectStage.updateUserStage).toHaveBeenCalledTimes(1);
  });
});

describe('person stage screen methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <PersonStageScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          name: 'Test',
          contactId: '123',
          currentStage: '2',
          contactAssignmentId: '333',
          noNav: true,
          section: 'section',
          subsection: 'subsection',
        })}
      />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('runs select stage with active', () => {
    
    component.handleSelectStage(mockStage, true);
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});

