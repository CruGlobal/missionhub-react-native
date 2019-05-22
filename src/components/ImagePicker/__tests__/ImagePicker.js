import React from 'react';
import { View, Alert } from 'react-native';
import MockDate from 'mockdate';
import ImageCropPicker from 'react-native-image-crop-picker';

import ImagePicker from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

jest.mock('react-native-image-crop-picker', () => ({
  openCamera: jest.fn(),
  openPicker: jest.fn(),
}));

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

  const buildAndPressPicker = () => {
    ImageCropPicker.openCamera.mockReturnValue(mockResponse);
    const component = renderShallow(<ImagePicker {...props} />);
    component.props().onPress();
  };

  describe('openCamera', () => {
    const openCameraTests = () => {
      expect(ImageCropPicker.openCamera).toHaveBeenCalled();
      expect(props.onSelectImage).toHaveBeenCalledWith(mockFinalData);
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

      buildAndPressPicker();
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

      buildAndPressPicker();
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

      buildAndPressPicker();
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
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        width: 700,
        height: 500,
        isVertical: false,
        uri: 'testuri.jpg',
      };

      buildAndPressPicker();
      openCameraTests();
    });
  });
});

it('error selecting image', () => {
  Alert.alert = jest.fn();
  const mockResponse = {
    error: true,
  };
  RNImagePicker.showImagePicker = jest.fn((a, b) => b(mockResponse));
  const component = renderShallow(<ImagePicker {...props} />);
  component.props().onPress();

  expect(Alert.alert).toHaveBeenCalled();
});
