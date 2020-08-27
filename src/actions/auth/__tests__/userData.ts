/* eslint-disable @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';
import MockDate from 'mockdate';
import * as RNOmniture from 'react-native-omniture';

import * as callApi from '../../api';
import { REQUESTS } from '../../../api/routes';
import { getFeatureFlags } from '../../misc';
import { updateLocaleAndTimezone, loadHome } from '../userData';
import { getMyPeople } from '../../people';
import { getMyCommunities } from '../../organizations';
import { getMe } from '../../person';
import { getStagesIfNotExists } from '../../stages';
import { rollbar } from '../../../utils/rollbar.config';
import { requestNativePermissions } from '../../notifications';
import * as common from '../../../utils/common';

const getMyCommunitiesResult = { type: 'got communities' };
const getMeResult = { type: 'got me successfully' };
const getPeopleResult = { type: 'get my people' };
const getStagesResult = { type: 'got stages' };
const updateUserResult = { type: 'updated locale and TZ' };

jest.mock('react-native-omniture');
jest.mock('../../misc');
jest.mock('../../notifications');
jest.mock('../../onboarding');
jest.mock('../../organizations');
jest.mock('../../person');
jest.mock('../../people');
jest.mock('../../stages');
jest.mock('../../steps');

((callApi as unknown) as {
  default: () => { type: string };
}).default = jest.fn().mockReturnValue({ type: 'test-action' });
(requestNativePermissions as jest.Mock).mockReturnValue({
  type: 'requestNativePermissions',
});

const refreshToken = 'khjdsfkksadjhsladjjldsvajdscandjehrwewrqr';
const upgradeToken = '2d2123bd-8142-42e7-98e4-81a0dd7a87a6';
const mockStore = configureStore([thunk]);

let store: MockStore;

beforeEach(() => {
  store = mockStore({
    auth: {
      token: 'testtoken',
      refreshToken,
      upgradeToken,
      person: {
        user: {},
      },
    },
  });
});

describe('updateLocaleAndTimezone', () => {
  it('should update timezone ', () => {
    store = mockStore({
      auth: {
        person: {
          user: {
            timezone: '-8',
            language: 'fr-CA',
          },
        },
      },
    });

    MockDate.set('2018-02-06');
    i18next.language = 'en-US';

    const newUserSettings = {
      data: {
        attributes: {
          timezone: '0',
          mobile_language: 'en-US',
        },
      },
    };

    store.dispatch<any>(updateLocaleAndTimezone());
    expect(callApi.default).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ME_USER,
      {},
      newUserSettings,
    );
  });
});

describe('loadHome', () => {
  const userSettings = {
    data: {
      attributes: {
        timezone: '0',
        mobile_language: 'en-US',
      },
    },
  };

  it('loads me, organizations, stages, timezone, and notifications', async () => {
    (getMe as jest.Mock).mockReturnValue(getMeResult);
    (getMyPeople as jest.Mock).mockReturnValue(getPeopleResult);
    (getMyCommunities as jest.Mock).mockReturnValue(getMyCommunitiesResult);
    (getStagesIfNotExists as jest.Mock).mockReturnValue(getStagesResult);
    ((callApi as unknown) as {
      default: jest.Mock;
    }).default.mockReturnValue(updateUserResult);

    await store.dispatch<any>(loadHome());

    expect(callApi.default).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ME_USER,
      {},
      userSettings,
    );

    expect(store.getActions()).toEqual([
      getMeResult,
      getPeopleResult,
      getMyCommunitiesResult,
      getStagesResult,
      updateUserResult,
    ]);
  });

  it('loads nothing because there is no token', async () => {
    store = mockStore({
      auth: {
        token: '',
        refreshToken,
        upgradeToken,
        person: {
          user: {},
        },
      },
    });

    await store.dispatch<any>(loadHome());

    expect(store.getActions()).toEqual([]);
  });
});
