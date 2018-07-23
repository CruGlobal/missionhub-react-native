import ReactNative from 'react-native';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { trackActionWithoutData } from '../../src/actions/analytics';
import {
  openCommunicationLink,
  loadStepsAndJourney,
  navigateToStageScreen,
} from '../../src/actions/misc';
import { getContactSteps } from '../../src/actions/steps';
import { reloadJourney } from '../../src/actions/journey';
import { updatePersonAttributes } from '../../src/actions/person';
import { navigatePush } from '../../src/actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';
import { STAGE_SCREEN } from '../../src/containers/StageScreen';

jest.mock('../../src/actions/analytics');
jest.mock('../../src/actions/steps');
jest.mock('../../src/actions/journey');
jest.mock('../../src/actions/navigation');
jest.mock('../../src/actions/person');

const mockStore = configureStore([thunk]);
let store;

const trackActionResult = { type: 'tracked' };
const getStepsResult = { type: 'got steps' };
const reloadJourneyResult = { type: 'reloaded journey' };
const navigatePushResult = { type: 'navigated forward' };
const updatePersonAttributesResult = { type: 'updated person' };

const url = 'url';
const action = { type: 'link action' };
const person = { id: '100' };
const organization = { id: 26 };
const contactAssignment = { id: '1908' };
const firstItemIndex = 3;
const stage = { id: '5' };

beforeEach(() => {
  store = mockStore();

  jest.clearAllMocks();
  trackActionWithoutData.mockReturnValue(trackActionResult);
  getContactSteps.mockReturnValue(getStepsResult);
  reloadJourney.mockReturnValue(reloadJourneyResult);
  updatePersonAttributes.mockReturnValue(updatePersonAttributesResult);
  ReactNative.Linking.openURL = jest.fn().mockReturnValue(Promise.resolve());

  navigatePush.mockImplementation((_, props) => {
    props.onComplete(stage);
    return navigatePushResult;
  });
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
