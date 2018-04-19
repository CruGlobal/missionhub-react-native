import { MAIN_TABS } from '../../src/constants';
import { ADD_SOMEONE_SCREEN } from '../../src/containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../../src/containers/GetStartedScreen';
import { initialRoute } from '../../src/actions/navigationInit';
import { LOGIN_SCREEN } from '../../src/containers/LoginScreen';

const token = 'sfhaspofuasdnfpwqnfoiqwofiwqioefpqwnofuoweqfniuqweouiowqefonpqnowfpowqfneqowfenopnqwnfeo';
const myId = '1';

const test = (store, route) => {
  expect(initialRoute(store)).toEqual(route);
};

describe('initialRoute', () => {
  describe('not logged in user', () => {
    it('should go to Login screen', () => {
      test(
        {
          auth: {
            token: null,
          },
        },
        LOGIN_SCREEN,
      );
    });
  });

  describe('logged in user', () => {
    it('has not completed onboarding but has a contact with pathway stage should go to MainTabs', () => {
      test(
        {
          auth: {
            token,
            person: { id: myId },
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
        MAIN_TABS,
      );
    });

    it('has completed onboarding but does not have contact with pathway stage should go to MainTabs', () => {
      test(
        {
          auth: {
            token,
          },
          personProfile: { hasCompletedOnboarding: true },
        },
        MAIN_TABS,
      );
    });

    describe('has not completed onboarding and does not have a contact with pathway stage', () => {
      it('has self stage should go to AddSomeone', () => {
        test(
          {
            auth: {
              token,
              person: {
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
          ADD_SOMEONE_SCREEN
        );
      });

      it('does not have self stage should go to GetStarted', () => {
        test(
          {
            auth: {
              token,
              person: {
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
          GET_STARTED_SCREEN
        );
      });

      it('should not check my reverse contact assignments', () => {
        test(
          {
            auth: {
              token,
              person: {
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
          GET_STARTED_SCREEN,
        );
      });
    });
  });
});
