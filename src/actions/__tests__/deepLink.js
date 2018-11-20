import firebase from 'react-native-firebase';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { setupFirebaseDynamicLinks } from '../deepLink';

jest.mock('react-native-firebase', () => ({
  links: jest.fn(),
}));

const mockStore = auth => configureStore([thunk])({ auth: { token: !!auth } });

const test = async ({
  auth,
  initialLink,
  expectedActions,
  deepLink = 'https://mhub.cc/c/1234567890123456',
}) => {
  firebase.links.mockReturnValue({
    getInitialLink: initialLink
      ? jest.fn().mockResolvedValue(deepLink)
      : jest.fn().mockResolvedValue(null),
    onLink: initialLink
      ? jest.fn()
      : jest.fn().mockImplementation(cb => cb(deepLink)),
  });

  const store = mockStore(auth);

  await store.dispatch(setupFirebaseDynamicLinks());

  expect(store.getActions()).toEqual(expectedActions);
};

describe('setupFirebaseDynamicLinks', () => {
  describe('unauthenticated', () => {
    it('should handle a link that launched the app', async () =>
      await test({
        auth: false,
        initialLink: true,
        expectedActions: [
          {
            type: 'testJoinCommunityUrlNoAuthAction',
            communityUrlCode: '1234567890123456',
          },
        ],
      }));
    it('should handle a link that was opened while the app was running', async () =>
      await test({
        auth: false,
        initialLink: false,
        expectedActions: [
          {
            type: 'testJoinCommunityUrlNoAuthAction',
            communityUrlCode: '1234567890123456',
          },
        ],
      }));
  });
  describe('authenticated', () => {
    it('should handle a link that launched the app', async () =>
      await test({
        auth: true,
        initialLink: true,
        expectedActions: [
          {
            type: 'testJoinCommunityUrlAuthAction',
            communityUrlCode: '1234567890123456',
          },
        ],
      }));
    it('should handle a link that was opened while the app was running', async () =>
      await test({
        auth: true,
        initialLink: false,
        expectedActions: [
          {
            type: 'testJoinCommunityUrlAuthAction',
            communityUrlCode: '1234567890123456',
          },
        ],
      }));
  });
  describe('unknown links', () => {
    it('should ignore an empty link', async () => {
      await test({
        deepLink: '',
        expectedActions: [],
      });
    });
    it('should ignore a link with the wrong domain', async () => {
      await test({
        deepLink: 'https://missionhub.com/c/1234567890123456',
        expectedActions: [],
      });
      await test({
        deepLink: 'https://missionhub.page.link/c/1234567890123456',
        expectedActions: [],
      });
    });
    it('should ignore a link with the wrong path', async () => {
      await test({
        deepLink: 'https://mhub.cc/s/1234567890123456',
        expectedActions: [],
      });
      test({
        deepLink: 'https://mhub.cc/1234567890123456',
        expectedActions: [],
      });
    });
    it('should ignore a link using http', async () => {
      await test({
        deepLink: 'http://mhub.cc/c/1234567890123456',
        expectedActions: [],
      });
    });
    it('should ignore a link with too short of a code', async () => {
      await test({
        deepLink: 'https://mhub.cc/c/123456789012345',
        expectedActions: [],
      });
    });
  });
});
