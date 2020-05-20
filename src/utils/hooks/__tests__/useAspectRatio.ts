import { Image } from 'react-native';
import { renderHook } from '@testing-library/react-hooks';

import { useAspectRatio } from '../useAspectRatio';

const mockImage = {
  uri: 'mocked uri',
  image: 'some mock image',
  width: 150,
  height: 50,
};

jest.mock('react-native', () => ({
  Image: {
    getSize: jest.fn().mockImplementation((_, callBack) => {
      callBack(mockImage.width, mockImage.height);
    }),
  },
}));

it('returns aspect ratio', () => {
  const { result } = renderHook(() => useAspectRatio(mockImage.uri));
  expect((Image.getSize as jest.Mock).mock.calls[0][0]).toBe(mockImage.uri);
  expect(result.current).toEqual(3);
});

it('returns default aspect ratio if no image is passed', () => {
  const { result } = renderHook(() => useAspectRatio(null));
  expect(result.current).toBe(2);
});
