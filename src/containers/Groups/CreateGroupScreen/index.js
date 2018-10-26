import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Keyboard,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  Flex,
  Text,
  Input,
  IconButton,
  Button,
} from '../../../components/common';
import Header from '../../Header';
import theme from '../../../theme';
import CAMERA_ICON from '../../../../assets/images/cameraIcon.png';
import { navigateBack } from '../../../actions/navigation';
import ImagePicker from '../../../components/ImagePicker';

import styles from './styles';

@translate('groupsCreateGroup')
class CreateGroupScreen extends Component {
  state = {
    name: '',
    imageUri: null,
  };

  onChangeText = text => this.setState({ name: text });

  createCommunity = () => {
    Keyboard.dismiss();
    const text = (this.state.name || '').trim();
    if (!text) {
      return;
    }

    // TODO: Create community
    // console.log('create community', text);
  };

  handleImageChange = data => this.setState({ imageUri: data.uri });

  navigateBack = () => this.props.dispatch(navigateBack());

  ref = c => (this.nameInput = c);

  renderImage() {
    const { imageUri } = this.state;
    if (imageUri) {
      return (
        <Image
          resizeMode="cover"
          source={{ uri: imageUri }}
          style={styles.image}
        />
      );
    }
    return <Image source={CAMERA_ICON} />;
  }

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          shadow={false}
          title={t('createCommunity')}
        />
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
          <ImagePicker onSelectImage={this.handleImageChange}>
            <Flex align="center" justify="center" style={styles.imageWrap}>
              {this.renderImage()}
            </Flex>
          </ImagePicker>

          <KeyboardAvoidingView
            keyboardVerticalOffset={theme.buttonHeight}
            style={styles.flex}
          >
            <Flex style={styles.fieldWrap}>
              <Text style={styles.label} type="header">
                {t('name')}
              </Text>
              <Input
                ref={this.ref}
                onChangeText={this.onChangeText}
                value={this.state.name}
                autoFocus={true}
                autoCorrect={true}
                selectionColor={theme.white}
                returnKeyType="done"
                style={styles.input}
                blurOnSubmit={true}
                placeholder=""
              />
            </Flex>
          </KeyboardAvoidingView>
        </ScrollView>

        <Flex align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.createCommunity}
            text={t('createCommunity').toUpperCase()}
            style={styles.createButton}
          />
        </Flex>
      </View>
    );
  }
}

CreateGroupScreen.propTypes = {};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(CreateGroupScreen);
export const CREATE_GROUP_SCREEN = 'nav/CREATE_GROUP_SCREEN';
