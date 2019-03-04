import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { REQUESTS } from '../../api';
import { logout, navigateToPostAuthScreen } from '../auth';
import { deletePushToken } from '../../notifications';

jest.mock('../../notifications');

const mockStore = configureStore([thunk]);

let store;

beforeEach(() => {
  store = mockStore();
});

describe('logout', () => {
  it('should perform the needed actions for signing out', async () => {
    deletePushToken.mockReturnValue({
      type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
    });
    await store.dispatch(logout());
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should perform the needed actions for forced signing out', async () => {
    deletePushToken.mockReturnValue({
      type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
    });
    await store.dispatch(logout(true));
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('navigateToPostAuthScreen', () => {
  it("should navigate to get started if user's pathway_stage_id is missing", () => {
    store = mockStore({
      auth: {
        person: {
          user: {},
        },
      },
    });

    store.dispatch(navigateToPostAuthScreen());
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should navigate to main tabs if user has pathway_stage_id and contact assignments', () => {
    store = mockStore({
      auth: {
        person: {
          contact_assignments: [{ pathway_stage_id: '1' }],
          user: {
            pathway_stage_id: '1',
          },
        },
      },
    });

    store.dispatch(navigateToPostAuthScreen());
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should navigate to add someone if user has pathway_stage_id and no contact assignments', () => {
    store = mockStore({
      auth: {
        person: {
          contact_assignments: [],
          user: {
            pathway_stage_id: '1',
          },
        },
      },
    });

    store.dispatch(navigateToPostAuthScreen());
    expect(store.getActions()).toMatchSnapshot();
  });
});
