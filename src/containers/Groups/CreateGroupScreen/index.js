import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Keyboard,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';

import { Flex, Text, Input, IconButton } from '../../../components/common';
import Header from '../../../components/Header';
import theme from '../../../theme';
import CAMERA_ICON from '../../../../assets/images/cameraIcon.png';
import {
  navigateBack,
  navigatePush,
  navigateToMainTabs,
} from '../../../actions/navigation';
import ImagePicker from '../../../components/ImagePicker';
import { addNewOrganization } from '../../../actions/organizations';
import { trackActionWithoutData } from '../../../actions/analytics';
import { organizationSelector } from '../../../selectors/organizations';
import { USER_CREATED_GROUP_SCREEN, GROUP_MEMBERS } from '../GroupScreen';
import { ACTIONS, GROUPS_TAB } from '../../../constants';
import BottomButton from '../../../components/BottomButton';
import Analytics from '../../Analytics';

import styles from './styles';

@withTranslation('groupsCreateGroup')
class CreateGroupScreen extends Component {
  state = {
    name: '',
    isCreatingCommunity: false,
    imageData: null,
  };

  onChangeText = text => this.setState({ name: text });

  createCommunity = async () => {
    const { dispatch } = this.props;
    const { name, imageData } = this.state;
    try {
      this.setState({ isCreatingCommunity: true });

      Keyboard.dismiss();
      const text = (name || '').trim();
      if (!text) {
        this.setState({ isCreatingCommunity: false });
        return Promise.resolve();
      }

      const { response: { id: newOrgId = undefined } = {} } = await dispatch(
        addNewOrganization(text, imageData),
      );

      this.getNewOrg(newOrgId);
      // The button never gets enabled again when successful because we are navigating away
    } catch (error) {
      this.setState({ isCreatingCommunity: false });
    }
  };

  getNewOrg = orgId => {
    const { organizations, dispatch } = this.props;

    if (orgId) {
      const organization = organizationSelector({ organizations }, { orgId });

      if (organization) {
        dispatch(
          navigatePush(USER_CREATED_GROUP_SCREEN, {
            orgId,
            initialTab: GROUP_MEMBERS,
          }),
        );
        return dispatch(
          trackActionWithoutData(ACTIONS.SELECT_CREATED_COMMUNITY),
        );
      }
    }

    // If for some reason the organization was not created and put in redux properly,
    // reset the user back to the communities tab
    dispatch(navigateToMainTabs(GROUPS_TAB));
  };

  handleImageChange = data => this.setState({ imageData: data });

  navigateBack = () => this.props.dispatch(navigateBack());

  ref = c => (this.nameInput = c);

  renderImage() {
    const { imageData } = this.state;
    if (imageData) {
      return (
        <Image
          resizeMode="cover"
          source={{ uri: imageData.uri }}
          style={styles.image}
        />
      );
    }
    return <Image source={CAMERA_ICON} />;
  }

  render() {
    const { t } = this.props;
    const { name, isCreatingCommunity } = this.state;

    return (
      <View style={styles.container}>
        <Analytics screenName={['communities', 'create']} />
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
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
              <Text style={styles.label} header={true}>
                {t('name')}
              </Text>
              <Input
                ref={this.ref}
                onChangeText={this.onChangeText}
                value={name}
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
        <BottomButton
          disabled={!name || isCreatingCommunity}
          onPress={this.createCommunity}
          text={t('createCommunity')}
        />
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
