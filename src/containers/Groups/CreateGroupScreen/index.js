import React, { Component } from 'react';
import { View, Keyboard, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  Flex,
  Text,
  Input,
  IconButton,
  Button,
  Touchable,
} from '../../../components/common';
import Header from '../../Header';
import theme from '../../../theme';
import CAMERA_ICON from '../../../../assets/images/cameraIcon.png';
import { navigateBack } from '../../../actions/navigation';

import styles from './styles';

@translate('groupsCreateGroup')
class CreateGroupScreen extends Component {
  state = {
    name: '',
  };

  onChangeText = text => this.setState({ name: text });

  createCommunity = () => {
    Keyboard.dismiss();
    const text = (this.state.name || '').trim();
    if (!text) {
      return;
    }

    // TODO: Create community
    console.log('create community', text);
  };

  navigateBack = () => this.props.dispatch(navigateBack());

  ref = c => (this.nameInput = c);

  renderImage() {
    return (
      <Touchable onPress={this.selectImage}>
        <Flex align="center" justify="center" style={styles.imageWrap}>
          <Image source={CAMERA_ICON} />
        </Flex>
      </Touchable>
    );
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
        {this.renderImage()}

        <Flex value={1} style={styles.fieldWrap}>
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

        <Flex value={1} align="stretch" justify="end">
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
