import React from 'react';
import { View, Alert, ActionSheetIOS } from 'react-native';
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

MockDate.set('2018-11-08');

const onSelectImage = jest.fn();
const mockBase64String = 'superLongBase64EncodedString';

it('renders image picker', () => {
  renderWithContext(
    <ImagePicker onSelectImage={onSelectImage}>
      <View />
    </ImagePicker>,
  ).snapshot();
});

it('renders image picker with circle overlay', () => {
  renderWithContext(
    <ImagePicker onSelectImage={onSelectImage} circleOverlay={true}>
      <View />
    </ImagePicker>,
  ).snapshot();
});

describe('press image picker', () => {
  let mockResponse = {};
  let mockFinalData = {};

  const buildAndPressPicker = async (actionIndex: number) => {
    ActionSheetIOS.showActionSheetWithOptions = jest.fn((a, b) =>
      b(actionIndex),
    );
    (ImageCropPicker.openCamera as jest.Mock).mockReturnValue(mockResponse);
    (ImageCropPicker.openPicker as jest.Mock).mockReturnValue(mockResponse);

    const { getByTestId } = renderWithContext(
      <ImagePicker onSelectImage={onSelectImage}>
        <View />
      </ImagePicker>,
    );

    await fireEvent(getByTestId('popupMenuButton'), 'onPress');
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
        data: mockBase64String,
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
        data: `data:image/jpeg;base64,${mockBase64String}`,
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
        data: mockBase64String,
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.png',
        fileType: 'image/png',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.png',
        data: `data:image/png;base64,${mockBase64String}`,
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
        data: mockBase64String,
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
        data: `data:image/jpeg;base64,${mockBase64String}`,
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
        data: mockBase64String,
      };
      mockFinalData = {
        fileSize: 1,
        fileName: `${new Date().valueOf()}.jpg`,
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
        data: `data:image/jpeg;base64,${mockBase64String}`,
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
        data: mockBase64String,
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
        data: `data:image/jpeg;base64,${mockBase64String}`,
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
        data: mockBase64String,
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.png',
        fileType: 'image/png',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.png',
        data: `data:image/png;base64,${mockBase64String}`,
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
        data: mockBase64String,
      };
      mockFinalData = {
        fileSize: 1,
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
        data: `data:image/jpeg;base64,${mockBase64String}`,
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
        data: mockBase64String,
      };
      mockFinalData = {
        fileSize: 1,
        fileName: `${new Date().valueOf()}.jpg`,
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
        data: `data:image/jpeg;base64,${mockBase64String}`,
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
