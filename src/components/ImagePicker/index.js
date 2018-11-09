import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';

const RNImagePicker = require('react-native-image-picker');

// See all options: https://github.com/react-community/react-native-image-picker/blob/master/docs/Reference.md#options
const DEFAULT_OPTIONS = {
  cameraType: 'back',
  mediaType: 'photo',
  maxWidth: 500, // photos only
  maxHeight: 500, // photos only
  quality: 0.75, // 0 to 1, photos only
  allowsEditing: true, // (iOS) Built in functionality to resize/reposition the image after selection
  noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

function getType(response) {
  if (response.uri.toLowerCase().includes('.png')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

@translate('imagePicker')
class ImagePicker extends Component {
  selectImage = () => {
    const { t, onSelectImage } = this.props;

    const pickerOptions = {
      ...DEFAULT_OPTIONS,
      // Set all the text values with translation strings
      title: t('selectImage'),
      cancelButtonTitle: t('cancel'),
      takePhotoButtonTitle: t('takePhoto'),
      chooseFromLibraryButtonTitle: t('chooseFromLibrary'),
      permissionDenied: {
        title: t('deniedTitle'),
        text: t('deniedText'),
        reTryTitle: t('reTryTitle'),
        okTitle: t('okTitle'),
      },
    };

    RNImagePicker.showImagePicker(pickerOptions, response => {
      if (response.didCancel) {
        // LOG('User cancelled image picker');
      } else if (response.error) {
        // LOG('RNImagePicker Error: ', response.error);
        Alert.alert(t('errorHeader'), t('errorBody'));
      } else {
        // You can display the image using either data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data, isStatic: true };

        const payload = {
          // imageBinary: `data:image/jpeg;base64,${response.data}`,
          fileSize: response.fileSize,
          fileName: response.fileName,
          fileType: response.type || getType(response),
          width: response.width,
          height: response.height,
          isVertical: response.isVertical,
          uri: response.uri,
        };
        onSelectImage(payload);
      }
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={this.selectImage} activeOpacity={0.75}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

ImagePicker.propTypes = {
  onSelectImage: PropTypes.func.isRequired, // func with args: (data, callback)
  children: PropTypes.element.isRequired,
};

export default ImagePicker;
