import ReactNative from 'react-native';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { trackActionWithoutData } from '../../src/actions/analytics';
import { openCommunicationLink } from '../../src/actions/misc';

jest.mock('../../src/actions/analytics');

const mockStore = configureStore([thunk]);
let store;

const trackActionResult = { type: 'tracked' };

beforeEach(() => {
  store = mockStore();
  trackActionWithoutData.mockReturnValue(trackActionResult);
});

describe('openCommunicationLink', () => {
  it('should test link, then open it, then track an action', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));
    ReactNative.Linking.openURL = jest.fn().mockReturnValue(Promise.resolve());
    const url = 'url';
    const action = { type: 'link action' };

    await store.dispatch(openCommunicationLink(url, action));

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
    expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(url);
    expect(trackActionWithoutData).toHaveBeenCalledWith(action);
    expect(store.getActions()).toEqual([trackActionResult]);
  });
});
