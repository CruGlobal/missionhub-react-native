import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fireEvent } from 'react-native-testing-library';

import StageScreen from '../StageScreen';
import {
  renderWithContext,
  createMockNavState,
  renderShallow,
  testSnapshot,
} from '../../../testUtils';
import * as selectStage from '../../actions/selectStage';
import * as navigation from '../../actions/navigation';

jest.mock('react-native-device-info');

const myId = '111';
const mockStage = {
  id: '0',
  name: 'uninterested',
};

const mockState = {
  auth: {
    person: {
      id: myId,
    },
  },
  profile: {
    firstName: 'Roger',
  },
  stages: { stages: [mockStage] },
};

const mockCurrentStage = { id: 2 };

const mockComplete = jest.fn();
const contactId = '123';
const orgId = '111';

const mockStore = configureStore([thunk]);
let store;
let component;

function buildShallowScreen(props) {
  return renderShallow(
    <StageScreen
      navigation={createMockNavState({
        name: 'Test',
        contactId,
        orgId,
        currentStage: mockCurrentStage.id,
        section: 'section',
        subsection: 'subsection',
        onComplete: mockComplete,
        dispatch: null,
        ...props,
      })}
    />,
    store,
  ).instance();
}

beforeEach(() => {
  store = mockStore(mockState);
});

it('renders correctly with back button', () => {
  renderWithContext(<StageScreen />, {
    initialState: mockState,
    navParams: {
      enableBackButton: true,
      section: 'section',
      subsection: 'subsection',
    },
  }).snapshot();
});

it('renders correctly without back button', () => {
  renderWithContext(<StageScreen />, {
    initialState: mockState,
    navParams: {
      enableBackButton: false,
      section: 'section',
      subsection: 'subsection',
    },
  }).snapshot();
});

describe('handleSelectStage', () => {
  const selectStageAction = { type: 'selected stage' };
  const selectMyStepNavAction = {
    type: 'navigated to select my step screen',
  };
  const navigateBackAction = { type: 'navigated back 2x' };
  const nextResponse = { type: 'next' };

  selectStage.selectMyStage = jest.fn(() => selectStageAction);
  navigation.navigatePush = jest.fn((screen, { next }) => {
    store.dispatch(next());
    return selectMyStepNavAction;
  });
  navigation.navigateBack = jest.fn(() => navigateBackAction);

  describe('when not already selected', () => {
    describe('and onComplete prop exists', () => {
      beforeEach(() => {
        component = buildShallowScreen({});
      });

      describe('and no nav is false', () => {
        it('should select stage, navigate to select step screen, then onComplete navigates to contact screen', async () => {
          await component.handleSelectStage(mockStage, false);

          expect(store.getActions()).toEqual([
            selectStageAction,
            navigateBackAction,
            selectMyStepNavAction,
          ]);
        });
      });
    });

    describe('and next prop exists', () => {
      it('should select stage, then call next', async () => {
        const next = jest.fn();
        next.mockReturnValue(nextResponse);

        const { getByTestId } = renderWithContext(<StageScreen next={next} />, {
          initialState: mockState,
          navParams: { orgId },
        });

        await fireEvent(getByTestId('StageButton0'), 'press', mockStage, false);

        expect(next).toHaveBeenCalledWith({
          stage: mockStage,
          myId,
          orgId,
          isAlreadySelected: false,
        });
        expect(store.getActions()).toEqual([selectStageAction, nextResponse]);
      });
    });
  });
});

describe('stage screen methods', () => {
  it('runs select stage with active', () => {
    component = buildShallowScreen({ noNav: true });

    component.handleSelectStage(mockStage, true);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });

  it('runs select stage with active', () => {
    component = buildShallowScreen({ noNav: true });

    component.handleSelectStage(mockStage, true);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});
