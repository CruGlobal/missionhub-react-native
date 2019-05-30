import React from 'react';
import { View, Alert } from 'react-native';
import MockDate from 'mockdate';
import ImageCropPicker from 'react-native-image-crop-picker';
import i18next from 'i18next';

import { showMenu } from '../../../utils/common';
import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

import ImagePicker from '..';

jest.mock('react-native-image-crop-picker', () => ({
  openCamera: jest.fn(),
  openPicker: jest.fn(),
}));
jest.mock('../../../utils/common');

MockDate.set('2018-11-08');
ImageCropPicker.openCamera = jest.fn();
ImageCropPicker.openPicker = jest.fn();

const props = {
  onSelectImage: jest.fn(),
  children: <View />,
};

it('renders image picker', () => {
  testSnapshotShallow(<ImagePicker {...props} />);
});

describe('press image picker', () => {
  let mockResponse = {};
  let mockFinalData = {};
  let component;
  let instance;

  const buildAndPressPicker = () => {
    ImageCropPicker.openCamera.mockReturnValue(mockResponse);
    ImageCropPicker.openPicker.mockReturnValue(mockResponse);
    component = renderShallow(<ImagePicker {...props} />);
    instance = component.instance();

    component.props().onPress();
  };

  describe('openCamera', () => {
    const openCameraTests = () => {
      expect(showMenu).toHaveBeenCalledWith(
        [
          {
            text: i18next.t('imagePicker:takePhoto'),
            onPress: instance.takePhoto,
          },
          {
            text: i18next.t('imagePicker:chooseFromLibrary'),
            onPress: instance.chooseFromLibrary,
          },
        ],
        instance.picker,
        i18next.t('imagePicker:selectImage'),
      );
      expect(ImageCropPicker.openCamera).toHaveBeenCalled();
      expect(props.onSelectImage).toHaveBeenCalledWith(mockFinalData);
    };

    beforeEach(() => {
      showMenu.mockImplementation(actions => actions[0].onPress());
    });

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

      await buildAndPressPicker();
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

      await buildAndPressPicker();
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

      await buildAndPressPicker();
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

      await buildAndPressPicker();
      openCameraTests();
    });
  });

  describe('openPicker', () => {
    const openPickerTests = () => {
      expect(showMenu).toHaveBeenCalledWith(
        [
          {
            text: i18next.t('imagePicker:takePhoto'),
            onPress: instance.takePhoto,
          },
          {
            text: i18next.t('imagePicker:chooseFromLibrary'),
            onPress: instance.chooseFromLibrary,
          },
        ],
        instance.picker,
        i18next.t('imagePicker:selectImage'),
      );
      expect(ImageCropPicker.openPicker).toHaveBeenCalled();
      expect(props.onSelectImage).toHaveBeenCalledWith(mockFinalData);
    };

    beforeEach(() => {
      showMenu.mockImplementation(actions => actions[1].onPress());
    });

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

      await buildAndPressPicker();
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

      await buildAndPressPicker();
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

      await buildAndPressPicker();
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

      await buildAndPressPicker();
      openPickerTests();
    });
  });

  describe('pick image errors', () => {
    beforeEach(() => {
      LOG = jest.fn();
      Alert.alert = jest.fn();
      showMenu.mockImplementation(actions => actions[1].onPress());
    });

    it('User does not give permission, not error', async () => {
      mockResponse = Promise.reject({ code: 'E_PERMISSION_MISSING' });
      await buildAndPressPicker();

      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('User canceled image picker, not error', async () => {
      mockResponse = Promise.reject({ code: 'E_PICKER_CANCELLED' });
      await buildAndPressPicker();

      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('error selecting image', async () => {
      mockResponse = Promise.reject({ code: 'OTHER_ERROR' });
      await buildAndPressPicker();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('imagePicker:errorHeader'),
        i18next.t('imagePicker:errorBody'),
      );
    });
  });
});
