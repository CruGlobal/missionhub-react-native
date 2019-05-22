import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import ImageCropPicker from 'react-native-image-crop-picker';

// See all options: https://github.com/ivpusic/react-native-image-crop-picker
const DEFAULT_OPTIONS = {
  mediaType: 'photo',
  width: 500,
  height: 300,
  compressImageQuality: 0.75, // 0 to 1
  cropping: true,
};

function getType(response) {
  if (response.uri.toLowerCase().includes('.png')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

@withTranslation('imagePicker')
class ImagePicker extends Component {
  selectImage = async () => {
    const { t, onSelectImage } = this.props;

    try {
      const response = await ImageCropPicker.openPicker(DEFAULT_OPTIONS);
      console.log(response);
    } catch (error) {
      if (error && error.code === 'E_PERMISSION_MISSING') {
        LOG('User cancelled image picker');
        return;
      }

      LOG('RNImagePicker Error: ', error);
      Alert.alert(t('errorHeader'), t('errorBody'));
      return;
    }

    /*
    RNImagePicker.showImagePicker(pickerOptions, response => {
      if (response.didCancel) {

      } else if (response.error) {

      } else {
        // You can display the image using either data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data, isStatic: true };

        const uri = response.uri;
        let fileName = response.fileName || '';
        // Handle strange iOS files "HEIC" format. If the file name is not a jpeg, but the uri is a jpg
        // create a new file name with the right extension
        if (uri.includes('.jpg') && !fileName.includes('.jpg')) {
          fileName = `${new Date().valueOf()}.jpg`;
        }
        const payload = {
          // imageBinary: `data:image/jpeg;base64,${response.data}`,
          fileSize: response.fileSize,
          fileName,
          fileType: response.type || getType(response),
          width: response.width,
          height: response.height,
          isVertical: response.isVertical,
          uri,
        };
        onSelectImage(payload);
      }
    });*/
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
