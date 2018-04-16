import { REHYDRATE } from 'redux-persist/constants';
import { MAIN_TABS } from '../../src/constants';
import { ADD_SOMEONE_SCREEN } from '../../src/containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../../src/containers/GetStartedScreen';
import navigation from '../../src/middleware/rehydrateNavigation';
import configureStore from 'redux-mock-store';
import { LOGIN_SCREEN } from '../../src/containers/LoginScreen';

const token = 'sfhaspofuasdnfpwqnfoiqwofiwqioefpqwnofuoweqfniuqweouiowqefonpqnowfpowqfneqowfenopnqwnfeo';
const myId = '1';

const mockStore = configureStore([ navigation ]);
let store;

const test = (data, route) => {
  store.dispatch(data);

  expect(store.getActions()).toEqual([ {
    ...data,
    payload: {
      ...data.payload,
      navigation: expect.objectContaining({
        routes: expect.arrayContaining([
          expect.objectContaining({
            routeName: route,
          }),
        ]),
      }),
    },
  } ]);

  expect(store.getActions()[0].payload.navigation.routes.length).toEqual(1);
};

beforeEach(() => {
  store = mockStore();
});

describe('rehydrate', () => {
  describe('not logged in user', () => {
    it('should go to Login screen', () => {
      test({
        type: REHYDRATE,
        payload: {
          auth: {
            isLoggedIn: true,
            token: null,
          },
        },
      }, LOGIN_SCREEN);
    });
  });

  describe('logged in user', () => {
    it('has not completed onboarding but has a contact with pathway stage should go to MainTabs', () => {
      test({
        type: REHYDRATE,
        payload: {
          auth: {
            isLoggedIn: true,
            token,
            user: { id: myId },
          },
          personProfile: { hasCompletedOnboarding: false },
          people: {
            allByOrg: {
              personal: {
                people: {
                  [myId]: {
                    id: myId,
                    reverse_contact_assignments: [],
                  },
                  '2': {
                    reverse_contact_assignments: [
                      {
                        assigned_to: { id: '3' },
                        pathway_stage_id: '4',
                      },
                      {
                        assigned_to: { id: myId },
                        pathway_stage_id: '5',
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      }, MAIN_TABS);
    });

    it('has completed onboarding but does not have contact with pathway stage should go to MainTabs', () => {
      test({
        type: REHYDRATE,
        payload: {
          auth: {
            isLoggedIn: true,
            token,
          },
          personProfile: { hasCompletedOnboarding: true },
        },
      }, MAIN_TABS);
    });

    describe('has not completed onboarding and does not have a contact with pathway stage', () => {
      it('has self stage should go to AddSomeone', () => {
        test({
          type: REHYDRATE,
          payload: {
            auth: {
              isLoggedIn: true,
              token,
              user: {
                id: myId,
                user: { pathway_stage_id: '3' },
              },
            },
            personProfile: { hasCompletedOnboarding: false },
            people: {
              allByOrg: {
                personal: { people: {} },
                '100': {
                  people: {
                    '2': {
                      reverse_contact_assignments: [
                        {
                          assigned_to: { id: '3' },
                          pathway_stage_id: '4',
                        },
                        {
                          assigned_to: { id: myId },
                          pathway_stage_id: null,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        }, ADD_SOMEONE_SCREEN);
      });

      it('does not have self stage should go to GetStarted', () => {
        test({
          type: REHYDRATE,
          payload: {
            auth: {
              isLoggedIn: true,
              token,
              user: {
                id: myId,
                user: { pathway_stage_id: null },
              },
            },
            personProfile: { hasCompletedOnboarding: false },
            people: {
              allByOrg: {
                personal: {
                  people: {
                    [myId]: { reverse_contact_assignments: [] },
                    '2': {
                      reverse_contact_assignments: [
                        {
                          assigned_to: { id: myId },
                          pathway_stage_id: null,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        }, GET_STARTED_SCREEN);
      });

      it('should not check my reverse contact assignments', () => {
        store.dispatch({
          type: REHYDRATE,
          payload: {
            auth: {
              isLoggedIn: true,
              token,
              user: {
                id: myId,
                user: { pathway_stage_id: null },
              },
            },
            personProfile: { hasCompletedOnboarding: false },
            people: {
              allByOrg: {
                personal: {
                  people: {
                    [myId]: {
                      id: myId,
                      reverse_contact_assignments: [
                        {
                          assigned_to: { id: myId },
                          pathway_stage_id: '3',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        }, GET_STARTED_SCREEN);
      });
    });
  });
});
