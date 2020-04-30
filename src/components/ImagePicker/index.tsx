import React from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import ImageCropPicker from 'react-native-image-crop-picker';

import PopupMenu from '../../components/PopupMenu';
// @ts-ignore
import theme from '../../theme.ts';
import { LOG } from '../../utils/logging';

// See all options: https://github.com/ivpusic/react-native-image-crop-picker
const DEFAULT_OPTIONS = {
  mediaType: 'photo',
  width: theme.fullWidth,
  height: theme.fullWidth * theme.communityImageAspectRatio,
  compressImageQuality: 0.75, // 0 to 1
  cropping: true,
  includeBase64: true,
};

export type PickerImage = {
  filename: string;
  path: string;
  size: number;
  mime: string;
  width: number;
  height: number;
  data: string;
};

export type ImageCropPickerResponse = PickerImage | PickerImage[];

export type SelectImageParams = {
  fileSize: number;
  fileName: string;
  fileType: string;
  width: number;
  height: number;
  isVertical: boolean;
  uri: string;
  data: string;
};

interface ImagePickerProps {
  onSelectImage: (image: SelectImageParams) => void;
  children: JSX.Element | JSX.Element[];
}

function getType(image: PickerImage) {
  if (image.path.toLowerCase().includes('.png')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

export const ImagePicker = ({ onSelectImage, children }: ImagePickerProps) => {
  const { t } = useTranslation('imagePicker');

  const takePhoto = () => selectImage(true);

  const chooseFromLibrary = () => selectImage(false);

  const selectImage = async (takePhoto: boolean) => {
    try {
      const response = (await (takePhoto
        ? ImageCropPicker.openCamera(DEFAULT_OPTIONS)
        : ImageCropPicker.openPicker(
            DEFAULT_OPTIONS,
          ))) as ImageCropPickerResponse;

      const image = Array.isArray(response) ? response[0] : response;

      let fileName = image.filename || '';
      const { path: uri, size: fileSize, mime, width, height, data } = image;

      // Handle strange iOS files "HEIC" format. If the file name is not a jpeg, but the uri is a jpg
      // create a new file name with the right extension
      if (uri.includes('.jpg') && !fileName.includes('.jpg')) {
        fileName = `${new Date().valueOf()}.jpg`;
      }

      const payload: SelectImageParams = {
        fileSize,
        fileName,
        fileType: mime || getType(image),
        width,
        height,
        isVertical: height > width,
        uri,
        data: `data:${mime || getType(image)};base64,${data}`,
      };

      onSelectImage(payload);
    } catch (error) {
      const errorCode = error && error.code;

      if (
        errorCode === 'E_PERMISSION_MISSING' ||
        errorCode === 'E_PICKER_CANCELLED'
      ) {
        LOG('User cancelled image picker');
        return;
      }

      LOG('RNImagePicker Error: ', error);
      Alert.alert(t('errorHeader'), t('errorBody'));
    }
  };

  return (
    <PopupMenu
      //@ts-ignore
      actions={[
        { text: t('takePhoto'), onPress: takePhoto },
        { text: t('chooseFromLibrary'), onPress: chooseFromLibrary },
      ]}
      buttonProps={{ isAndroidOpacity: true, activeOpacity: 0.75 }}
      title={t('selectImage')}
    >
      {children}
    </PopupMenu>
  );
};

export default ImagePicker;
