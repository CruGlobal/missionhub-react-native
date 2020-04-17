import React from 'react';
import { View, Alert } from 'react-native';
import * as ReactNative from 'react-native';
import MockDate from 'mockdate';
import ImageCropPicker from 'react-native-image-crop-picker';
import i18next from 'i18next';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import ImagePicker from '..';

jest.mock('react-native-image-crop-picker', () => ({
  openCamera: jest.fn(),
  openPicker: jest.fn(),
}));
jest.mock('../../../utils/common');

MockDate.set('2018-11-08');

let onSelectImage = jest.fn();

beforeEach(() => {
  onSelectImage = jest.fn();
});

it('renders image picker', () => {
  renderWithContext(
    <ImagePicker onSelectImage={onSelectImage}>
      <View />
    </ImagePicker>,
  );
});

describe('press image picker', () => {
  let mockResponse = {};
  let mockFinalData = {};

  const buildAndPressPicker = (actionIndex: number) => {
    (ImageCropPicker.openCamera as jest.Mock).mockReturnValue(mockResponse);
    (ImageCropPicker.openPicker as jest.Mock).mockReturnValue(mockResponse);

    const { getAllByTestId } = renderWithContext(
      <ImagePicker onSelectImage={onSelectImage}>
        <View />
      </ImagePicker>,
    );

    fireEvent(getAllByTestId('popupMenuButton')[actionIndex], 'onPress');
  };

  describe('openCamera', () => {
    const openCameraTests = () => {
      expect(ImageCropPicker.openCamera).toHaveBeenCalled();
      expect(onSelectImage).toHaveBeenCalledWith(mockFinalData);
    };

    it('selects .jpg image', () => {
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

      buildAndPressPicker(0);
      openCameraTests();
    });

    it('selects image without type and parses out png', () => {
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

      buildAndPressPicker(0);
      openCameraTests();
    });

    it('selects image without type and parses out jpg', () => {
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

      buildAndPressPicker(0);
      openCameraTests();
    });

    it('selects image without type and parses out heic and puts in jpg', () => {
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

      buildAndPressPicker(0);
      openCameraTests();
    });
  });

  describe('openPicker', () => {
    const openPickerTests = () => {
      expect(ImageCropPicker.openPicker).toHaveBeenCalled();
      expect(onSelectImage).toHaveBeenCalledWith(mockFinalData);
    };

    it('selects .jpg image', () => {
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

      buildAndPressPicker(1);
      openPickerTests();
    });

    it('selects image without type and parses out png', () => {
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

      buildAndPressPicker(1);
      openPickerTests();
    });

    it('selects image without type and parses out jpg', () => {
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

      buildAndPressPicker(1);
      openPickerTests();
    });

    it('selects image without type and parses out heic and puts in jpg', () => {
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

      buildAndPressPicker(1);
      openPickerTests();
    });
  });

  describe('pick image errors', () => {
    beforeEach(() => {
      Alert.alert = jest.fn();
    });

    it('User does not give permission, not error', () => {
      mockResponse = Promise.reject({ code: 'E_PERMISSION_MISSING' });
      buildAndPressPicker(1);

      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('User canceled image picker, not error', () => {
      mockResponse = Promise.reject({ code: 'E_PICKER_CANCELLED' });
      buildAndPressPicker(1);

      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('error selecting image', () => {
      mockResponse = Promise.reject({ code: 'OTHER_ERROR' });
      buildAndPressPicker(1);

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('imagePicker:errorHeader'),
        i18next.t('imagePicker:errorBody'),
      );
    });
  });
});
