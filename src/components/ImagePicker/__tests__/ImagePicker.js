import React from 'react';
import { View, Alert } from 'react-native';

import ImagePicker from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

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
    fileName: 'test.file',
    fileType: 'image/jpeg',
    width: 500,
    height: 500,
    isVertical: false,
    uri: 'testuri',
  };
  RNImagePicker.showImagePicker = jest.fn((a, b) => b(mockResponse));
  const component = renderShallow(<ImagePicker {...props} />);
  component.props().onPress();

  expect(props.onSelectImage).toHaveBeenCalledWith(mockResponse);
});

it('selects image without type and parses out png', () => {
  const mockResponse = {
    fileSize: 1,
    fileName: 'test.file',
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

it('selects image without type and parses out png', () => {
  const mockResponse = {
    fileSize: 1,
    fileName: 'test.file',
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
