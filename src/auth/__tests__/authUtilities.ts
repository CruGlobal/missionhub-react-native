import * as SecureStore from 'expo-secure-store';

import { warmAuthCache, loadAuthPerson, getAuthPerson } from '../authUtilities';
import { apolloClient } from '../../apolloClient';
import { AUTH_PERSON } from '../queries';
import { getCachedAuthToken } from '../authStore';

jest.mock('expo-secure-store');
jest.spyOn(apolloClient, 'query');
jest.spyOn(apolloClient, 'readQuery');

describe('warmAuthCache', () => {
  it('should load the auth token into memory and load the auth person', async () => {
    const token = 'test token';
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

    await warmAuthCache();

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: AUTH_PERSON,
      fetchPolicy: 'network-only',
    });
    expect(getCachedAuthToken()).toEqual(token);
  });
});

describe('loadAuthPerson', () => {
  it('should return the auth person', async () => {
    const fetchPolicy = 'cache-first';

    expect(await loadAuthPerson(fetchPolicy)).toMatchInlineSnapshot(`
    Object {
      "__typename": "Person",
      "fbUid": "ratione ut sunt",
      "firstName": "Hayden",
      "fullName": "Hayden Zieme",
      "globalRegistryMdmId": "consequuntur corporis repellat",
      "id": "2",
      "lastName": "Zieme",
      "stage": Object {
        "__typename": "Stage",
        "id": "3",
        "selfFollowupDescription": "quisquam recusandae alias",
      },
      "theKeyUid": "qui amet iure",
    }
    `);
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: AUTH_PERSON,
      fetchPolicy,
    });
  });
});

describe('getAuthPerson', () => {
  it('should return the auth person', () => {
    expect(getAuthPerson()).toMatchInlineSnapshot(`
    Object {
      "__typename": "Person",
      "fbUid": "ratione ut sunt",
      "firstName": "Hayden",
      "fullName": "Hayden Zieme",
      "globalRegistryMdmId": "consequuntur corporis repellat",
      "id": "2",
      "lastName": "Zieme",
      "stage": Object {
        "__typename": "Stage",
        "id": "3",
        "selfFollowupDescription": "quisquam recusandae alias",
      },
      "theKeyUid": "qui amet iure",
    }
    `);
    expect(apolloClient.readQuery).toHaveBeenCalledWith({
      query: AUTH_PERSON,
    });
  });
});
