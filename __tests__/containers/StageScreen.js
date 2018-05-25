import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import StageScreen from '../../src/containers/StageScreen';
import {
  createMockNavState,
  mockFnWithParams,
  renderShallow,
  testSnapshot,
} from '../../testUtils';
import * as selectStage from '../../src/actions/selectStage';
import * as navigation from '../../src/actions/navigation';
import { SELECT_MY_STEP_SCREEN } from '../../src/containers/SelectMyStepScreen';

jest.mock('react-native-device-info');

const mockState = {
  profile: {
    firstName: 'Roger',
  },
  stages: {},
};
const mockStage = {
  id: 1,
};
const mockComplete = jest.fn();
const contactId = '123';

const mockStore = configureStore([thunk]);
let store;
let component;

function buildShallowScreen(props) {
  return renderShallow(
    <StageScreen
      navigation={createMockNavState({
        name: 'Test',
        contactId: contactId,
        currentStage: '2',
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
  mockComplete.mockReset();
});

it('StageScreen renders correctly with back button', () => {
  testSnapshot(
    <Provider store={store}>
      <StageScreen
        navigation={createMockNavState({
          enableBackButton: true,
          section: 'section',
          subsection: 'subsection',
        })}
      />
    </Provider>,
  );
});

describe('StageScreen', () => {
  let tree;

  beforeEach(() => {
    tree = renderer.create(
      <Provider store={store}>
        <StageScreen
          navigation={createMockNavState({
            enableBackButton: false,
            section: 'section',
            subsection: 'subsection',
          })}
        />
      </Provider>,
    );
  });

  it('renders correctly without back button', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('handleSelectStage', () => {
  beforeEach(() => {
    component = buildShallowScreen({});
  });

  describe('when not already selected', () => {
    describe('and no nav is false', () => {
      it('should select stage, navigate to select step screen, then onComplete navigates to contact screen', async () => {
        const selectMyStepNavAction = {
          type: 'navigated to select my step screen',
        };
        const navigateBackAction = { type: 'navigated back 2x' };
        const selectStageAction = { type: 'selected stage' };
        const selectStageResult = dispatch => {
          dispatch(selectStageAction);
          return dispatch(() => Promise.resolve());
        };
        mockFnWithParams(
          selectStage,
          'selectMyStage',
          selectStageResult,
          mockStage.id,
        );
        navigation.navigatePush = jest.fn((screenName, params) => {
          if (
            screenName === SELECT_MY_STEP_SCREEN &&
            params.onSaveNewSteps &&
            params.enableBackButton &&
            params.contactStage === mockStage
          ) {
            params.onSaveNewSteps(); //todo figure out cleaner way to test this
            return selectMyStepNavAction;
          }
        });
        mockFnWithParams(navigation, 'navigateBack', navigateBackAction, 2);

        await component.handleSelectStage(mockStage, false);

        expect(store.getActions()).toEqual([
          selectStageAction,
          navigateBackAction,
          selectMyStepNavAction,
        ]);
      });
    });
  });
});

describe('stage screen methods', () => {
  beforeEach(() => {
    component = buildShallowScreen({ noNav: true });
  });

  it('runs select stage with active', () => {
    component.handleSelectStage(mockStage, true);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});
