/* eslint-disable @typescript-eslint/no-explicit-any, max-lines */

import ReactNative from 'react-native';
import thunk from 'redux-thunk';
import configureStore, { MockStore } from 'redux-mock-store';

import { apolloClient } from '../../apolloClient';
import { trackActionWithoutData } from '../analytics';
import {
  openCommunicationLink,
  navigateToStageScreen,
  navigateToAddStepFlow,
  GET_FEATURE_FLAGS,
  getFeatureFlags,
} from '../misc';
import { updatePersonAttributes } from '../person';
import { reloadJourney } from '../journey';
import { navigatePush, navigateReplace } from '../navigation';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../../selectors/people';
import { hasOrgPermissions, buildTrackingObj } from '../../utils/common';
import {
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
} from '../../routes/constants';

jest.mock('../analytics');
jest.mock('../steps');
jest.mock('../journey');
jest.mock('../navigation');
jest.mock('../person');
jest.mock('../../selectors/people');
jest.mock('../../utils/common');
jest.mock('../../auth/authUtilities', () => ({
  getAuthPerson: () => ({
    id: '111',
  }),
}));

const mockStore = configureStore([thunk]);
let store: MockStore;

apolloClient.query = jest.fn();

const trackActionResult = { type: 'tracked' };
const reloadJourneyResult = { type: 'reloaded journey' };
const navigatePushResult = { type: 'navigated forward' };
const navigateReplaceResult = { type: 'route replaced' };
const updatePersonAttributesResult = { type: 'updated person' };
const hasOrgPermissionsResult = false;
const buildTrackingObjResult = { tracking: 'tracking' };

const myId = '111';
const personId = '100';
const url = 'url';
const action = { type: 'link action' };
const person = { id: personId, first_name: 'Fred' };
const contactAssignment = { id: '1908' };
const orgPermission = { id: '1234' };
const firstItemIndex = 3;
const stage = { id: '5' };

beforeEach(() => {
  store = mockStore();

  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (reloadJourney as jest.Mock).mockReturnValue(reloadJourneyResult);
  (updatePersonAttributes as jest.Mock).mockReturnValue(
    updatePersonAttributesResult,
  );
  ReactNative.Linking.openURL = jest.fn().mockReturnValue(Promise.resolve());
  ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
    contactAssignment,
  );
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    orgPermission,
  );
  (hasOrgPermissions as jest.Mock).mockReturnValue(hasOrgPermissionsResult);
  (buildTrackingObj as jest.Mock).mockReturnValue(buildTrackingObjResult);
  (navigatePush as jest.Mock).mockImplementation((_, { onComplete }) => {
    onComplete && onComplete(stage);
    return navigatePushResult;
  });
  (navigateReplace as jest.Mock).mockReturnValue(navigateReplaceResult);
});

describe('getFeatureFlags', () => {
  getFeatureFlags();

  expect(apolloClient.query).toHaveBeenCalledWith({
    query: GET_FEATURE_FLAGS,
  });
});

describe('openCommunicationLink', () => {
  it('should test link, then open it, then track an action', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    // @ts-ignore
    await store.dispatch(openCommunicationLink(url, action));

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
    expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(url);
    expect(trackActionWithoutData).toHaveBeenCalledWith(action);
    // @ts-ignore
    expect(store.getActions()).toEqual([trackActionResult]);
  });

  it('should not open link if it is not supported', async () => {
    // @ts-ignore
    global.WARN = jest.fn();
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(false));

    // @ts-ignore
    await store.dispatch(openCommunicationLink(url, action));

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
    expect(ReactNative.Linking.openURL).not.toHaveBeenCalled();
    expect(trackActionWithoutData).not.toHaveBeenCalled();
  });
});

describe('navigateToStageScreen', () => {
  it('should navigate to self stage screen', () => {
    store.dispatch<any>(navigateToStageScreen(myId));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STAGE_FLOW, {
      selectedStageId: undefined,
      personId: myId,
    });
    expect(store.getActions()).toEqual([navigatePushResult]);
  });

  it('should navigate to person stage screen', () => {
    store.dispatch<any>(navigateToStageScreen(personId, firstItemIndex, true));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_PERSON_STAGE_FLOW, {
      selectedStageId: firstItemIndex,
      personId: person.id,
      skipSelectSteps: true,
    });
    expect(store.getActions()).toEqual([navigatePushResult]);
  });
});

describe('navigateToAddStepFlow', () => {
  it('navigates to add my step flow', () => {
    store.dispatch<any>(navigateToAddStepFlow(myId));

    expect(navigatePush).toHaveBeenCalledWith(ADD_MY_STEP_FLOW, {
      personId: myId,
    });
    expect(store.getActions()).toEqual([navigatePushResult]);
  });

  it('navigates to add person step flow', () => {
    store.dispatch<any>(navigateToAddStepFlow(personId));

    expect(navigatePush).toHaveBeenCalledWith(ADD_PERSON_STEP_FLOW, {
      personId,
    });
    expect(store.getActions()).toEqual([navigatePushResult]);
  });
});
