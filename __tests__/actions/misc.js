import ReactNative from 'react-native';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { trackActionWithoutData } from '../../src/actions/analytics';
import {
  openCommunicationLink,
  loadStepsAndJourney,
} from '../../src/actions/misc';
import { getContactSteps } from '../../src/actions/steps';
import { reloadJourney } from '../../src/actions/journey';

jest.mock('../../src/actions/analytics');
jest.mock('../../src/actions/steps');
jest.mock('../../src/actions/journey');

const mockStore = configureStore([thunk]);
let store;

const trackActionResult = { type: 'tracked' };
const getStepsResult = { type: 'got steps' };
const reloadJourneyResult = { type: 'reloaded journey' };

const url = 'url';
const action = { type: 'link action' };
const person = { id: '100' };
const organization = { id: 26 };

beforeEach(() => {
  store = mockStore();

  jest.clearAllMocks();
  trackActionWithoutData.mockReturnValue(trackActionResult);
  getContactSteps.mockReturnValue(getStepsResult);
  reloadJourney.mockReturnValue(reloadJourneyResult);
  ReactNative.Linking.openURL = jest.fn().mockReturnValue(Promise.resolve());
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
