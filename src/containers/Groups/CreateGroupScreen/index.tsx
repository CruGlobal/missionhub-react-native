import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';

import { Flex, Input, IconButton } from '../../../components/common';
import Header from '../../../components/Header';
import theme from '../../../theme';
import CAMERA_ICON from '../../../../assets/images/cameraIcon.png';
import {
  navigateBack,
  navigateToMainTabs,
  navigateNestedReset,
} from '../../../actions/navigation';
import ImagePicker, {
  SelectImageParams,
} from '../../../components/ImagePicker';
import { addNewOrganization } from '../../../actions/organizations';
import { trackActionWithoutData } from '../../../actions/analytics';
import { organizationSelector } from '../../../selectors/organizations';
import { ACTIONS, COMMUNITIES_TAB, MAIN_TABS } from '../../../constants';
import BottomButton from '../../../components/BottomButton';
import Analytics from '../../Analytics';
import { COMMUNITY_TABS } from '../../Communities/Community/constants';
import { COMMUNITY_MEMBERS } from '../../Communities/Community/CommunityMembers/CommunityMembers';
import { RootState } from '../../../reducers';

import styles from './styles';

// @ts-ignore
@withTranslation('groupsCreateGroup')
class CreateGroupScreen extends Component {
  state = {
    name: '',
    isCreatingCommunity: false,
    imageData: null,
  };

  onChangeText = (text: string) => this.setState({ name: text });

  createCommunity = async () => {
    // @ts-ignore
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
        // @ts-ignore
        addNewOrganization(text, imageData),
      );

      this.getNewOrg(newOrgId);
      // The button never gets enabled again when successful because we are navigating away
    } catch (error) {
      this.setState({ isCreatingCommunity: false });
    }
  };

  // @ts-ignore
  getNewOrg = orgId => {
    // @ts-ignore
    const { organizations, dispatch } = this.props;

    if (orgId) {
      const organization = organizationSelector(
        { organizations } as RootState,
        { orgId },
      );

      if (organization) {
        dispatch(
          navigateNestedReset([
            {
              routeName: MAIN_TABS,
              tabName: COMMUNITIES_TAB,
            },
            {
              routeName: COMMUNITY_TABS,
              params: {
                communityId: orgId,
              },
            },
            {
              routeName: COMMUNITY_MEMBERS,
              params: {
                communityId: orgId,
              },
            },
          ]),
        );
        return dispatch(
          trackActionWithoutData(ACTIONS.SELECT_CREATED_COMMUNITY),
        );
      }
    }

    // If for some reason the organization was not created and put in redux properly,
    // reset the user back to the communities tab
    dispatch(navigateToMainTabs(COMMUNITIES_TAB));
  };

  handleImageChange = (data: SelectImageParams) =>
    this.setState({ imageData: data });

  // @ts-ignore
  navigateBack = () => this.props.dispatch(navigateBack());

  renderImage() {
    const { imageData } = this.state;
    if (imageData) {
      return (
        <Image
          testID="createCommunityImageDisplay"
          resizeMode="cover"
          // @ts-ignore
          source={{ uri: imageData.uri }}
          style={styles.image}
        />
      );
    }
    return <Image source={CAMERA_ICON} />;
  }

  render() {
    // @ts-ignore
    const { t } = this.props;
    const { name, isCreatingCommunity } = this.state;

    return (
      <View style={styles.container}>
        <Analytics screenName={['communities', 'create']} />
        <Header
          left={
            <IconButton
              testID="backButton"
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          title={t('createCommunity')}
        />
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
          <ImagePicker
            testID="createCommunityImagePicker"
            onSelectImage={this.handleImageChange}
          >
            <Flex align="center" justify="center" style={styles.imageWrap}>
              {this.renderImage()}
            </Flex>
          </ImagePicker>
          <KeyboardAvoidingView
            keyboardVerticalOffset={theme.buttonHeight}
            style={styles.flex}
          >
            <Flex style={styles.fieldWrap}>
              <Text style={styles.label}>{t('name')}</Text>
              <Input
                testID="communityName"
                onChangeText={this.onChangeText}
                value={name}
                autoFocus={true}
                autoCorrect={true}
                selectionColor={theme.white}
                returnKeyType="done"
                style={styles.input}
                blurOnSubmit={true}
                placeholder=""
                maxLength={44}
              />
            </Flex>
          </KeyboardAvoidingView>
        </ScrollView>
        <BottomButton
          testID="createCommunityButton"
          disabled={!name || isCreatingCommunity}
          onPress={this.createCommunity}
          text={t('createCommunity')}
        />
      </View>
    );
  }
}

// @ts-ignore
CreateGroupScreen.propTypes = {};

// @ts-ignore
const mapStateToProps = ({ organizations }, { navigation }) => ({
  ...(navigation.state.params || {}),
  organizations,
});

export default connect(mapStateToProps)(CreateGroupScreen);
export const CREATE_GROUP_SCREEN = 'nav/CREATE_GROUP_SCREEN';
