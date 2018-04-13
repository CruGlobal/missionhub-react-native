import { REHYDRATE } from 'redux-persist/constants';
import nav from '../../src/reducers/nav';
import { MAIN_TABS } from '../../src/constants';
import { ADD_SOMEONE_SCREEN } from '../../src/containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../../src/containers/GetStartedScreen';

const token = 'sfhaspofuasdnfpwqnfoiqwofiwqioefpqwnofuoweqfniuqweouiowqefonpqnowfpowqfneqowfenopnqwnfeo';
const myId = '1';

const expectRouteToBe = (state, routeName) => {
  expect(state.routes[0].routeName).toEqual(routeName);
  expect(state.routes.length).toEqual(1);
};

describe('rehydrate', () => {
  describe('logged in user', () => {
    it('has not completed onboarding but has a contact with pathway stage should go to MainTabs', () => {
      const state = nav({}, {
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
      });

      expectRouteToBe(state, MAIN_TABS);
    });

    it('has completed onboarding but does not have contact with pathway stage should go to MainTabs', () => {
      const state = nav({}, {
        type: REHYDRATE,
        payload: {
          auth: {
            isLoggedIn: true,
            token,
          },
          personProfile: { hasCompletedOnboarding: true },
        },
      });

      expectRouteToBe(state, MAIN_TABS);
    });

    describe('has not completed onboarding and does not have a contact with pathway stage', () => {
      it('has self stage should go to AddSomeone', () => {
        const state = nav({}, {
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
        });

        expectRouteToBe(state, ADD_SOMEONE_SCREEN);
      });

      it('does not have self stage should go to GetStarted', () => {
        const state = nav({}, {
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
        });

        expectRouteToBe(state, GET_STARTED_SCREEN);
      });

      it('should not check my reverse contact assignments', () => {
        const state = nav({}, {
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
        });

        expectRouteToBe(state, GET_STARTED_SCREEN);
      });
    });
  });

  it('returns same state if user is not logged in', () => {
    const state = nav({},
      {
        type: REHYDRATE,
        payload: {
          auth: {
            token: null,
            isLoggedIn: true,
          },
        },
      });

    expect(state).toEqual({});
  });
});
