import React from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import ImageCropPicker, { Image } from 'react-native-image-crop-picker';

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
};

// @ts-ignore
function getType(response: Image) {
  if (response.path.toLowerCase().includes('.png')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

export type imagePayload = {
  fileSize: number;
  fileName: string;
  fileType: string;
  width: number;
  height: number;
  isVertical: boolean;
  uri: string;
};

interface ImagePickerProps {
  onSelectImage: (image: imagePayload) => void;
  children: JSX.Element;
}

export const ImagePicker = ({ onSelectImage, children }: ImagePickerProps) => {
  const { t } = useTranslation('imagePicker');

  const takePhoto = () => {
    selectImage(true);
  };

  const chooseFromLibrary = () => {
    selectImage(false);
  };

  const selectImage = async (takePhoto: boolean) => {
    try {
      const response = (await (takePhoto
        ? ImageCropPicker.openCamera(DEFAULT_OPTIONS)
        : ImageCropPicker.openPicker(DEFAULT_OPTIONS))) as Image;

      let fileName = response.filename || '';
      const { path: uri, size: fileSize, mime, width, height } = response;

      // Handle strange iOS files "HEIC" format. If the file name is not a jpeg, but the uri is a jpg
      // create a new file name with the right extension
      if (uri.includes('.jpg') && !fileName.includes('.jpg')) {
        fileName = `${new Date().valueOf()}.jpg`;
      }

      const payload = {
        fileSize,
        fileName,
        fileType: mime || getType(response),
        width,
        height,
        isVertical: height > width,
        uri,
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
