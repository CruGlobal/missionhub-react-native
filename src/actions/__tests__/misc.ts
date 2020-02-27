import ReactNative from 'react-native';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { trackActionWithoutData } from '../analytics';
import {
  openCommunicationLink,
  loadStepsAndJourney,
  navigateToStageScreen,
  assignContactAndPickStage,
  navigateToAddStepFlow,
} from '../misc';
import {
  createContactAssignment,
  updatePersonAttributes,
  getPersonScreenRoute,
} from '../person';
import { getContactSteps } from '../steps';
import { reloadJourney } from '../journey';
import { navigatePush, navigateReplace } from '../navigation';
import { CONTACT_PERSON_SCREEN } from '../../containers/Groups/AssignedPersonScreen';
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

// @ts-ignore
const mockStore = state => configureStore([thunk])(state);
// @ts-ignore
let store;

const trackActionResult = { type: 'tracked' };
const getStepsResult = { type: 'got steps' };
const reloadJourneyResult = { type: 'reloaded journey' };
const navigatePushResult = { type: 'navigated forward' };
const navigateReplaceResult = { type: 'route replaced' };
const updatePersonAttributesResult = { type: 'updated person' };
const createContactAssignmentResult = () => Promise.resolve({ person });
const hasOrgPermissionsResult = false;
const buildTrackingObjResult = { tracking: 'tracking' };

const groups_feature = true;
const myId = '111';
const mePerson = {
  id: myId,
  user: {
    groups_feature,
  },
};
const orgId = '26';
const personId = '100';
const url = 'url';
const action = { type: 'link action' };
const person = { id: personId, first_name: 'Fred' };
const organization = { id: orgId };
const contactAssignment = { id: '1908' };
const orgPermission = { id: '1234' };
const firstItemIndex = 3;
const stage = { id: '5' };
const state = {
  auth: { person: mePerson },
};

beforeEach(() => {
  store = mockStore(state);

  // @ts-ignore
  trackActionWithoutData.mockReturnValue(trackActionResult);
  // @ts-ignore
  getContactSteps.mockReturnValue(getStepsResult);
  // @ts-ignore
  reloadJourney.mockReturnValue(reloadJourneyResult);
  // @ts-ignore
  updatePersonAttributes.mockReturnValue(updatePersonAttributesResult);
  ReactNative.Linking.openURL = jest.fn().mockReturnValue(Promise.resolve());
  // @ts-ignore
  contactAssignmentSelector.mockReturnValue(contactAssignment);
  // @ts-ignore
  createContactAssignment.mockReturnValue(createContactAssignmentResult);
  // @ts-ignore
  getPersonScreenRoute.mockReturnValue(CONTACT_PERSON_SCREEN);
  // @ts-ignore
  orgPermissionSelector.mockReturnValue(orgPermission);
  // @ts-ignore
  hasOrgPermissions.mockReturnValue(hasOrgPermissionsResult);
  // @ts-ignore
  buildTrackingObj.mockReturnValue(buildTrackingObjResult);

  // @ts-ignore
  navigatePush.mockImplementation((_, { onComplete }) => {
    onComplete && onComplete(stage);
    return navigatePushResult;
  });
  // @ts-ignore
  navigateReplace.mockReturnValue(navigateReplaceResult);
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

describe('loadStepsAndJourney', () => {
  it('should load steps and reload journey', () => {
    // @ts-ignore
    store.dispatch(loadStepsAndJourney(person.id, organization.id));

    // @ts-ignore
    expect(store.getActions()).toEqual([getStepsResult, reloadJourneyResult]);
    expect(getContactSteps).toHaveBeenCalledWith(person.id, organization.id);
    expect(reloadJourney).toHaveBeenCalledWith(person.id, organization.id);
  });
});

describe('assignContactAndPickStage', () => {
  it('creates a new contact assignment and navigates to the stage screen', async () => {
    // @ts-ignore
    await store.dispatch(assignContactAndPickStage(person, organization));

    expect(createContactAssignment).toHaveBeenCalledWith(orgId, myId, personId);
    expect(contactAssignmentSelector).toHaveBeenCalledWith(state, {
      person,
      orgId,
    });
    expect(getPersonScreenRoute).toHaveBeenCalledWith(
      mePerson,
      person,
      organization,
      contactAssignment,
    );
    expect(navigateReplace).toHaveBeenCalledWith(CONTACT_PERSON_SCREEN, {
      person,
      organization,
    });
    expect(navigatePush).toHaveBeenCalledWith(SELECT_PERSON_STAGE_FLOW, {
      personId,
      orgId: orgId,
      section: 'people',
      subsection: 'person',
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([
      navigateReplaceResult,
      navigatePushResult,
    ]);
  });
});

describe('navigateToStageScreen', () => {
  it('should navigate to self stage screen if first param is true', async () => {
    // @ts-ignore
    await store.dispatch(
      navigateToStageScreen(
        true,
        person,
        null,
        organization,
        firstItemIndex,
        // @ts-ignore
        true,
      ),
    );

    expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STAGE_FLOW, {
      selectedStageId: firstItemIndex,
      personId: person.id,
      section: 'people',
      subsection: 'self',
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([navigatePushResult]);
  });

  it('should navigate to person stage screen if first param is false', async () => {
    // @ts-ignore
    await store.dispatch(
      navigateToStageScreen(
        false,
        {
          ...person,
          reverse_contact_assignments: [{ id: contactAssignment.id }],
        },
        contactAssignment,
        organization,
        firstItemIndex,
        // @ts-ignore
        true,
      ),
    );

    expect(navigatePush).toHaveBeenCalledWith(SELECT_PERSON_STAGE_FLOW, {
      selectedStageId: firstItemIndex,
      personId: person.id,
      orgId: organization.id,
      section: 'people',
      subsection: 'person',
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([navigatePushResult]);
  });
});

describe('navigateToAddStepFlow', () => {
  beforeEach(() => {});

  it('navigates to add my step flow', async () => {
    // @ts-ignore
    await store.dispatch(navigateToAddStepFlow(true, mePerson, organization));

    expect(buildTrackingObj).toHaveBeenCalledWith(
      'people : person : steps : add',
      'people',
      'person',
      'steps',
    );
    expect(navigatePush).toHaveBeenCalledWith(ADD_MY_STEP_FLOW, {
      trackingObj: buildTrackingObjResult,
      personId: myId,
      organization,
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([navigatePushResult]);
  });

  it('navigates to add person step flow', async () => {
    // @ts-ignore
    await store.dispatch(navigateToAddStepFlow(false, person, organization));

    expect(buildTrackingObj).toHaveBeenCalledWith(
      'people : person : steps : add',
      'people',
      'person',
      'steps',
    );
    expect(buildTrackingObj).toHaveBeenCalledWith(
      'people : person : steps : create',
      'people',
      'person',
      'steps',
    );
    expect(navigatePush).toHaveBeenCalledWith(ADD_PERSON_STEP_FLOW, {
      trackingObj: buildTrackingObjResult,
      personId: person.id,
      organization,
      createStepTracking: buildTrackingObjResult,
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([navigatePushResult]);
  });
});
