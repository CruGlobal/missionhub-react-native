import React from 'react';
import { View, Alert } from 'react-native';
import MockDate from 'mockdate';

import ImagePicker from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

MockDate.set('2018-11-08');

const RNImagePicker = require('react-native-image-picker');

const props = {
  onSelectImage: jest.fn(),
  children: <View />,
};

it('renders image picker', () => {
  testSnapshotShallow(<ImagePicker {...props} />);
});

it('selects image', () => {
  const mockResponse = {
    fileSize: 1,
    fileName: 'test.jpg',
    fileType: 'image/jpeg',
    width: 500,
    height: 500,
    isVertical: false,
    uri: 'testuri.jpg',
  };
  RNImagePicker.showImagePicker = jest.fn((a, b) => b(mockResponse));
  const component = renderShallow(<ImagePicker {...props} />);
  component.props().onPress();

  expect(props.onSelectImage).toHaveBeenCalledWith(mockResponse);
});

it('selects image without type and parses out png', () => {
  const mockResponse = {
    fileSize: 1,
    fileName: 'test.png',
    width: 500,
    height: 500,
    isVertical: false,
    uri: 'testuri.png',
  };
  RNImagePicker.showImagePicker = jest.fn((a, b) => b(mockResponse));
  const component = renderShallow(<ImagePicker {...props} />);
  component.props().onPress();

  expect(props.onSelectImage).toHaveBeenCalledWith({
    ...mockResponse,
    fileType: 'image/png',
  });
});

it('selects image without type and parses out jpg', () => {
  const mockResponse = {
    fileSize: 1,
    fileName: 'test.jpg',
    width: 500,
    height: 500,
    isVertical: false,
    uri: 'testuri.jpg',
  };
  RNImagePicker.showImagePicker = jest.fn((a, b) => b(mockResponse));
  const component = renderShallow(<ImagePicker {...props} />);
  component.props().onPress();

  expect(props.onSelectImage).toHaveBeenCalledWith({
    ...mockResponse,
    fileType: 'image/jpeg',
  });
});

it('selects image without type and parses out heic and puts in jpg', () => {
  const mockResponse = {
    fileSize: 1,
    fileName: 'test.heic', // weird file format on iOS
    width: 500,
    height: 500,
    isVertical: false,
    uri: 'testuri.jpg',
  };
  RNImagePicker.showImagePicker = jest.fn((a, b) => b(mockResponse));
  const component = renderShallow(<ImagePicker {...props} />);
  component.props().onPress();

  const fileName = `${new Date().valueOf()}.jpg`;
  expect(props.onSelectImage).toHaveBeenCalledWith({
    ...mockResponse,
    fileType: 'image/jpeg',
    fileName,
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
