import ReactNative from 'react-native';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { trackActionWithoutData } from '../analytics';
import {
  openCommunicationLink,
  loadStepsAndJourney,
  navigateToStageScreen,
  assignContactAndPickStage,
} from '../misc';
import {
  createContactAssignment,
  updatePersonAttributes,
  getPersonScreenRoute,
} from '../person';
import { getContactSteps } from '../steps';
import { reloadJourney } from '../journey';
import { navigatePush, navigateReplace } from '../navigation';
import { PERSON_STAGE_SCREEN } from '../../containers/PersonStageScreen';
import { STAGE_SCREEN } from '../../containers/StageScreen';
import { CONTACT_PERSON_SCREEN } from '../../containers/Groups/AssignedPersonScreen';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
} from '../../selectors/people';
import { hasOrgPermissions } from '../../utils/common';

jest.mock('../analytics');
jest.mock('../steps');
jest.mock('../journey');
jest.mock('../navigation');
jest.mock('../person');
jest.mock('../../selectors/people');
jest.mock('../../utils/common');

const mockStore = state => configureStore([thunk])(state);
let store;

const trackActionResult = { type: 'tracked' };
const getStepsResult = { type: 'got steps' };
const reloadJourneyResult = { type: 'reloaded journey' };
const navigatePushResult = { type: 'navigated forward' };
const navigateReplaceResult = { type: 'route replaced' };
const updatePersonAttributesResult = { type: 'updated person' };
const createContactAssignmentResult = () => Promise.resolve({ person });
const hasOrgPermissionsResult = false;

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
const person = { id: personId };
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

  jest.clearAllMocks();
  trackActionWithoutData.mockReturnValue(trackActionResult);
  getContactSteps.mockReturnValue(getStepsResult);
  reloadJourney.mockReturnValue(reloadJourneyResult);
  updatePersonAttributes.mockReturnValue(updatePersonAttributesResult);
  ReactNative.Linking.openURL = jest.fn().mockReturnValue(Promise.resolve());
  contactAssignmentSelector.mockReturnValue(contactAssignment);
  createContactAssignment.mockReturnValue(createContactAssignmentResult);
  getPersonScreenRoute.mockReturnValue(CONTACT_PERSON_SCREEN);
  orgPermissionSelector.mockReturnValue(orgPermission);
  hasOrgPermissions.mockReturnValue(hasOrgPermissionsResult);

  navigatePush.mockImplementation((_, props) => {
    props.onComplete(stage);
    return navigatePushResult;
  });
  navigateReplace.mockReturnValue(navigateReplaceResult);
});

describe('openCommunicationLink', () => {
  it('should test link, then open it, then track an action', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    await store.dispatch(openCommunicationLink(url, action));

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
    expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(url);
    expect(trackActionWithoutData).toHaveBeenCalledWith(action);
    expect(store.getActions()).toEqual([trackActionResult]);
  });

  it('should not open link if it is not supported', async () => {
    global.WARN = jest.fn();
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(false));

    await store.dispatch(openCommunicationLink(url, action));

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
    expect(ReactNative.Linking.openURL).not.toHaveBeenCalled();
    expect(trackActionWithoutData).not.toHaveBeenCalled();
  });
});

describe('loadStepsAndJourney', () => {
  it('should load steps and reload journey', () => {
    store.dispatch(loadStepsAndJourney(person, organization));

    expect(store.getActions()).toEqual([getStepsResult, reloadJourneyResult]);
    expect(getContactSteps).toHaveBeenCalledWith(person.id, organization.id);
    expect(reloadJourney).toHaveBeenCalledWith(person.id, organization.id);
  });
});

describe('assignContactAndPickStage', () => {
  it('creates a new contact assignment and navigates to the stage screen', async () => {
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
    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      contactId: personId,
      orgId: orgId,
      contactAssignmentId: contactAssignment.id,
      name: person.first_name,
      onComplete: expect.anything(),
      section: 'people',
      subsection: 'person',
    });
    expect(getContactSteps).toHaveBeenCalledWith(personId, orgId);
    expect(reloadJourney).toHaveBeenCalledWith(personId, orgId);
    expect(store.getActions()).toEqual([
      navigateReplaceResult,
      getStepsResult,
      reloadJourneyResult,
      navigatePushResult,
    ]);
  });
});

describe('navigateToStageScreen', () => {
  it('should navigate to self stage screen if first param is true', async () => {
    await store.dispatch(
      navigateToStageScreen(
        true,
        person,
        null,
        organization,
        firstItemIndex,
        true,
      ),
    );

    expect(navigatePush).toHaveBeenCalledWith(STAGE_SCREEN, {
      onComplete: expect.anything(),
      firstItem: firstItemIndex,
      contactId: person.id,
      section: 'people',
      subsection: 'self',
      enableBackButton: true,
      noNav: true,
    });
    expect(updatePersonAttributes).toHaveBeenCalledWith(person.id, {
      user: { pathway_stage_id: stage.id },
    });
    expect(store.getActions()).toEqual([
      updatePersonAttributesResult,
      getStepsResult,
      reloadJourneyResult,
      navigatePushResult,
    ]);
  });

  it('should navigate to person stage screen if first param is false', async () => {
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
        true,
      ),
    );

    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      onComplete: expect.anything(),
      firstItem: firstItemIndex,
      name: person.first_name,
      contactId: person.id,
      contactAssignmentId: contactAssignment.id,
      orgId: organization.id,
      section: 'people',
      subsection: 'person',
      noNav: true,
    });
    expect(updatePersonAttributes).toHaveBeenCalledWith(person.id, {
      reverse_contact_assignments: [
        { id: contactAssignment.id, pathway_stage_id: stage.id },
      ],
    });
    expect(store.getActions()).toEqual([
      updatePersonAttributesResult,
      getStepsResult,
      reloadJourneyResult,
      navigatePushResult,
    ]);
  });
});
