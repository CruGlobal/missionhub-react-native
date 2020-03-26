import { navigateToMainTabs, navigateReset } from '../navigation';
import { resetToInitialRoute } from '../navigationInit';
import { createThunkStore } from '../../../testUtils';
import { startOnboarding } from '../onboarding';

jest.mock('../navigation');
jest.mock('../onboarding');
jest.mock('../analytics');
jest.mock('../misc');

const token =
  'sfhaspofuasdnfpwqnfoiqwofiwqioefpqwnofuoweqfniuqweouiowqefonpqnowfpowqfneqowfenopnqwnfeo';
const myId = '1';

const navigateToMainTabsResult = { type: 'nav to main tabs' };
const navigateResetResult = { type: 'navigate refresh' };
const startOnboardingResult = { type: 'start onboarding' };

beforeEach(() => {
  (navigateToMainTabs as jest.Mock).mockReturnValue(navigateToMainTabsResult);
  (navigateReset as jest.Mock).mockReturnValue(navigateResetResult);
  (startOnboarding as jest.Mock).mockReturnValue(startOnboardingResult);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const test = (store: { [key: string]: any }) => {
  const mockStore = createThunkStore(store);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockStore.dispatch<any>(resetToInitialRoute());
  expect(mockStore.getActions()).toMatchSnapshot();
};

describe('initialRoute', () => {
  describe('not logged in user', () => {
    it('should go to Login screen', () => {
      test({
        auth: {
          token: '',
        },
      });
    });
  });

  describe('logged in user', () => {
    it('has not completed onboarding but has a contact with pathway stage should go to MainTabs', () => {
      test({
        auth: {
          token,
          person: { id: myId },
        },
        onboarding: { skippedAddingPerson: false },
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
      });
    });

    it('has skipped adding person but does not have contact with pathway stage should go to MainTabs', () => {
      test({
        auth: {
          token,
        },
        onboarding: { skippedAddingPerson: true },
      });
    });

    describe('has not completed onboarding and does not have a contact with pathway stage', () => {
      it('has self stage should go to AddSomeone', () => {
        test({
          auth: {
            token,
            person: {
              id: myId,
              user: { pathway_stage_id: '3' },
            },
          },
          onboarding: { skippedAddingPerson: false },
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
        });
      });

      it('does not have self stage should go to GetStarted', () => {
        test({
          auth: {
            token,
            person: {
              id: myId,
              user: { pathway_stage_id: null },
            },
          },
          onboarding: { skippedAddingPerson: false },
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
        });
      });

      it('should not check my reverse contact assignments', () => {
        test({
          auth: {
            token,
            person: {
              id: myId,
              user: { pathway_stage_id: null },
            },
          },
          onboarding: { skippedAddingPerson: false },
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
        });
      });
    });
  });
});
