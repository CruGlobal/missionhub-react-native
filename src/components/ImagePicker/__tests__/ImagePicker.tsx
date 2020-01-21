import React from 'react';
import { View, Alert } from 'react-native';
import MockDate from 'mockdate';
import ImageCropPicker from 'react-native-image-crop-picker';
import i18next from 'i18next';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

import ImagePicker from '..';

jest.mock('react-native-image-crop-picker', () => ({
  openCamera: jest.fn(),
  openPicker: jest.fn(),
}));
jest.mock('../../../utils/common');

MockDate.set('2018-11-08');

const onSelectImage = jest.fn();

beforeEach(() => {
  // @ts-ignore
  onSelectImage.mockReturnValue();
});

it('renders image picker', () => {
  testSnapshotShallow(
    // @ts-ignore
    <ImagePicker onSelectImage={onSelectImage}>
      <View />
    </ImagePicker>,
  );
});

describe('press image picker', () => {
  let mockResponse = {};
  let mockFinalData = {};
  let component;

  // @ts-ignore
  const buildAndPressPicker = actionIndex => {
    // @ts-ignore
    ImageCropPicker.openCamera.mockReturnValue(mockResponse);
    // @ts-ignore
    ImageCropPicker.openPicker.mockReturnValue(mockResponse);

    component = renderShallow(
      // @ts-ignore
      <ImagePicker onSelectImage={onSelectImage}>
        <View />
      </ImagePicker>,
    );

    // @ts-ignore
    component.props().actions[actionIndex].onPress();
  };

  describe('openCamera', () => {
    const openCameraTests = () => {
      expect(ImageCropPicker.openCamera).toHaveBeenCalled();
      expect(onSelectImage).toHaveBeenCalledWith(mockFinalData);
    };

    it('selects .jpg image', async () => {
      mockResponse = {
        size: 1,
        filename: 'test.jpg',
        mime: 'image/jpeg',
        width: 700,
        height: 500,
        path: 'testuri.jpg',
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
      };

      await buildAndPressPicker(0);
      openCameraTests();
    });

    it('selects image without type and parses out png', async () => {
      mockResponse = {
        size: 1,
        filename: 'test.png',
        width: 700,
        height: 500,
        path: 'testuri.png',
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.png',
        fileType: 'image/png',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.png',
      };

      await buildAndPressPicker(0);
      openCameraTests();
    });

    it('selects image without type and parses out jpg', async () => {
      mockResponse = {
        size: 1,
        filename: 'test.jpg',
        width: 700,
        height: 500,
        path: 'testuri.jpg',
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
      };

      await buildAndPressPicker(0);
      openCameraTests();
    });

    it('selects image without type and parses out heic and puts in jpg', async () => {
      mockResponse = {
        size: 1,
        filename: 'test.heic',
        width: 700,
        height: 500,
        path: 'testuri.jpg',
      };
      mockFinalData = {
        fileSize: 1,
        fileName: `${new Date().valueOf()}.jpg`,
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
      };

      await buildAndPressPicker(0);
      openCameraTests();
    });
  });

  describe('openPicker', () => {
    const openPickerTests = () => {
      expect(ImageCropPicker.openPicker).toHaveBeenCalled();
      expect(onSelectImage).toHaveBeenCalledWith(mockFinalData);
    };

    it('selects .jpg image', async () => {
      mockResponse = {
        size: 1,
        filename: 'test.jpg',
        mime: 'image/jpeg',
        width: 700,
        height: 500,
        path: 'testuri.jpg',
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
      };

      await buildAndPressPicker(1);
      openPickerTests();
    });

    it('selects image without type and parses out png', async () => {
      mockResponse = {
        size: 1,
        filename: 'test.png',
        width: 700,
        height: 500,
        path: 'testuri.png',
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.png',
        fileType: 'image/png',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.png',
      };

      await buildAndPressPicker(1);
      openPickerTests();
    });

    it('selects image without type and parses out jpg', async () => {
      mockResponse = {
        size: 1,
        filename: 'test.jpg',
        width: 700,
        height: 500,
        path: 'testuri.jpg',
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
      };

      await buildAndPressPicker(1);
      openPickerTests();
    });

    it('selects image without type and parses out heic and puts in jpg', async () => {
      mockResponse = {
        size: 1,
        filename: 'test.heic',
        width: 700,
        height: 500,
        path: 'testuri.jpg',
      };
      mockFinalData = {
        fileSize: 1,
        fileName: `${new Date().valueOf()}.jpg`,
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
      };

      await buildAndPressPicker(1);
      openPickerTests();
    });
  });

  describe('pick image errors', () => {
    beforeEach(() => {
      Alert.alert = jest.fn();
    });

    it('User does not give permission, not error', async () => {
      mockResponse = Promise.reject({ code: 'E_PERMISSION_MISSING' });
      await buildAndPressPicker(1);

      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('User canceled image picker, not error', async () => {
      mockResponse = Promise.reject({ code: 'E_PICKER_CANCELLED' });
      await buildAndPressPicker(1);

      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('error selecting image', async () => {
      mockResponse = Promise.reject({ code: 'OTHER_ERROR' });
      await buildAndPressPicker(1);

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('imagePicker:errorHeader'),
        i18next.t('imagePicker:errorBody'),
      );
    });
  });
});
