import * as SecureStore from 'expo-secure-store';

import {
  getAuthToken,
  getCachedAuthToken,
  deleteAllAuthTokens,
  setAuthToken,
  isAuthenticated,
  getTheKeyRefreshToken,
  setTheKeyRefreshToken,
  getAnonymousUid,
  setAnonymousUid,
  deleteAnonymousUid,
  getAppleUserId,
  setAppleUserId,
  getMissionHubRefreshToken,
  setMissionHubRefreshToken,
} from '../authStore';

jest.mock('expo-secure-store');

describe('auth token', () => {
  describe('getAuthToken', () => {
    it('should return the auth token', async () => {
      const token = 'test token';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

      expect(await getAuthToken()).toEqual(token);
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('authToken');
    });
  });

  describe('getCachedAuthToken', () => {
    it('should return the cached auth token', async () => {
      const token = 'test token';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);
      await deleteAllAuthTokens();

      expect(getCachedAuthToken()).toEqual(null);
      await getAuthToken();
      expect(getCachedAuthToken()).toEqual(token);
      await deleteAllAuthTokens();
      expect(getCachedAuthToken()).toEqual(null);
      const newToken = 'new test token';
      await setAuthToken(newToken);
      expect(getCachedAuthToken()).toEqual(newToken);
    });

    describe('setAuthToken', () => {
      it('should set the auth token', async () => {
        const token = 'test token';

        expect(await setAuthToken(token)).toEqual(undefined);
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
          'authToken',
          token,
        );
      });
    });

    describe('isAuthenticated', () => {
      it('should return true if auth token exists', async () => {
        const token = 'test token';
        await setAuthToken(token);

        expect(isAuthenticated()).toEqual(true);
      });

      it("should return false if auth token doesn't exist", async () => {
        await deleteAllAuthTokens();

        expect(isAuthenticated()).toEqual(false);
      });
    });
  });
});

describe('MissionHub refresh token', () => {
  describe('getMissionHubRefreshToken', () => {
    it('should return the refresh token', async () => {
      const token = 'test token';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

      expect(await getMissionHubRefreshToken()).toEqual(token);
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(
        'missionhubRefreshToken',
      );
    });
  });

  describe('setTheKeyRefreshToken', () => {
    it('should set the refresh token', async () => {
      const token = 'test token';

      expect(await setMissionHubRefreshToken(token)).toEqual(undefined);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'missionhubRefreshToken',
        token,
      );
    });
  });
});

describe('The Key refresh token', () => {
  describe('getTheKeyRefreshToken', () => {
    it('should return the refresh token', async () => {
      const token = 'test token';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

      expect(await getTheKeyRefreshToken()).toEqual(token);
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(
        'theKeyRefreshToken',
      );
    });
  });

  describe('setTheKeyRefreshToken', () => {
    it('should set the refresh token', async () => {
      const token = 'test token';

      expect(await setTheKeyRefreshToken(token)).toEqual(undefined);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'theKeyRefreshToken',
        token,
      );
    });
  });
});

describe('anonymous user id', () => {
  describe('getAnonymousUid', () => {
    it('should return the uid', async () => {
      const token = 'test token';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

      expect(await getAnonymousUid()).toEqual(token);
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('anonymousUid');
    });
  });

  describe('setAnonymousUid', () => {
    it('should set the uid', async () => {
      const token = 'test token';

      expect(await setAnonymousUid(token)).toEqual(undefined);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'anonymousUid',
        token,
      );
    });
  });

  describe('deleteAnonymousUid', () => {
    it('should delete the uid', async () => {
      expect(await deleteAnonymousUid()).toEqual(undefined);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('anonymousUid');
    });
  });
});

describe('Apple user id', () => {
  describe('getAppleUserId', () => {
    it('should return the uid', async () => {
      const token = 'test token';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

      expect(await getAppleUserId()).toEqual(token);
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('appleUserId');
    });
  });

  describe('setAnonymousUid', () => {
    it('should set the uid', async () => {
      const token = 'test token';

      expect(await setAppleUserId(token)).toEqual(undefined);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'appleUserId',
        token,
      );
    });
  });
});

describe('deleteAllAuthTokens', () => {
  it('should delete all auth tokens', async () => {
    await deleteAllAuthTokens();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('authToken');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      'missionhubRefreshToken',
    );
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      'theKeyRefreshToken',
    );
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('anonymousUid');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('appleUserId');

    expect(isAuthenticated()).toEqual(false);
    expect(getCachedAuthToken()).toEqual(null);
  });
});
