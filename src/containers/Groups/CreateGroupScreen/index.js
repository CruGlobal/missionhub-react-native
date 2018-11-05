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
import {
  navigateBack,
  navigatePush,
  navigateReset,
} from '../../../actions/navigation';
import ImagePicker from '../../../components/ImagePicker';
import {
  addNewOrganization,
  getMyCommunities,
} from '../../../actions/organizations';
import { organizationSelector } from '../../../selectors/organizations';
import { USER_CREATED_GROUP_SCREEN } from '../GroupScreen';
import { MAIN_TABS } from '../../../constants';

import styles from './styles';

@translate('groupsCreateGroup')
class CreateGroupScreen extends Component {
  state = {
    name: '',
    imageUri: null,
  };

  onChangeText = text => this.setState({ name: text });

  createCommunity = async () => {
    const { dispatch } = this.props;
    Keyboard.dismiss();
    const text = (this.state.name || '').trim();
    if (!text) {
      return Promise.resolve();
    }

    const results = await dispatch(addNewOrganization(text));
    const newOrgId = results.response.id;
    // Load the list of communities
    await dispatch(getMyCommunities());
    this.getNewOrg(newOrgId);
  };

  getNewOrg = orgId => {
    const { organizations, dispatch } = this.props;
    const organization = organizationSelector({ organizations }, { orgId });

    // If for some reason the organization was not created and put in redux properly,
    // reset the user back to the communities tab
    if (!organization) {
      dispatch(navigateReset(MAIN_TABS, { startTab: 'groups' }));
    } else {
      dispatch(navigatePush(USER_CREATED_GROUP_SCREEN, { organization }));
    }
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
    const { name } = this.state;

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
            disabled={!name}
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

const mapStateToProps = ({ organizations }, { navigation }) => ({
  ...(navigation.state.params || {}),
  organizations,
});

export default connect(mapStateToProps)(CreateGroupScreen);
export const CREATE_GROUP_SCREEN = 'nav/CREATE_GROUP_SCREEN';
