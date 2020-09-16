/* eslint-disable @typescript-eslint/no-explicit-any */

import i18next from 'i18next';
import MockDate from 'mockdate';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import * as callApi from '../../api';
import { REQUESTS } from '../../../api/routes';
import { updateLocaleAndTimezone, loadHome } from '../userData';
import { getMyPeople } from '../../people';
import { getMyCommunities } from '../../organizations';
import { getMe } from '../../person';
import { getStagesIfNotExists } from '../../stages';
import { requestNativePermissions } from '../../notifications';
import { createThunkStore } from '../../../../testUtils';
import { isAuthenticated } from '../../../auth/authStore';

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
jest.mock('../../../auth/authStore');

((callApi as unknown) as {
  default: () => { type: string };
}).default = jest.fn().mockReturnValue({ type: 'test-action' });
(requestNativePermissions as jest.Mock).mockReturnValue({
  type: 'requestNativePermissions',
});

const store = createThunkStore();

beforeEach(() => {
  store.clearActions();
});

describe('updateLocaleAndTimezone', () => {
  it('should update timezone ', async () => {
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

    await flushMicrotasksQueue();

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
    (isAuthenticated as jest.Mock).mockReturnValue(true);
    (getMe as jest.Mock).mockReturnValue(getMeResult);
    (getMyPeople as jest.Mock).mockReturnValue(getPeopleResult);
    (getMyCommunities as jest.Mock).mockReturnValue(getMyCommunitiesResult);
    (getStagesIfNotExists as jest.Mock).mockReturnValue(getStagesResult);
    ((callApi as unknown) as {
      default: jest.Mock;
    }).default.mockReturnValue(updateUserResult);

    await store.dispatch<any>(loadHome());

    await flushMicrotasksQueue();

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

  it('should load nothing if the user is not authenticated', async () => {
    (isAuthenticated as jest.Mock).mockReturnValue(false);
    await store.dispatch<any>(loadHome());

    expect(store.getActions()).toEqual([]);
  });
});
