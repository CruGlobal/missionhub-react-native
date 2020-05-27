/* eslint max-lines: 0, max-lines-per-function: 0 */

import React, { Component } from 'react';
import { View, Alert, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import {
  Flex,
  Input,
  Text,
  Button,
  Separator,
  IconButton,
  DateComponent,
} from '../../../components/common';
import CAMERA_ICON from '../../../../assets/images/cameraIcon.png';
import ImagePicker from '../../../components/ImagePicker';
import theme from '../../../theme';
import {
  copyText,
  isAdminOrOwner,
  isOwner,
  getCommunityUrl,
  orgIsUserCreated,
} from '../../../utils/common';
import { getAnalyticsPermissionType } from '../../../utils/analytics';
import { navigateBack, navigateToMainTabs } from '../../../actions/navigation';
import {
  updateOrganization,
  updateOrganizationImage,
  deleteOrganization,
  generateNewCode,
  generateNewLink,
} from '../../../actions/organizations';
import {
  trackActionWithoutData,
  trackScreenChange,
} from '../../../actions/analytics';
import { organizationSelector } from '../../../selectors/organizations';
import {
  ACTIONS,
  COMMUNITIES_TAB,
  ANALYTICS_PERMISSION_TYPE,
} from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import PopupMenu from '../../../components/PopupMenu';
import Header from '../../../components/Header';
import Analytics from '../../Analytics';

import styles from './styles';

// @ts-ignore
@withTranslation('groupProfile')
class GroupProfile extends Component {
  state = { editing: false, name: '', imageData: null };

  save = async () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    const { imageData, name } = this.state;

    const didNameChange = name !== organization.name;
    if (!didNameChange && !imageData) {
      // Nothing changed, dont update
      return;
    }
    if (didNameChange) {
      await dispatch(updateOrganization(organization.id, { name }));
    }
    if (imageData) {
      // @ts-ignore
      await dispatch(updateOrganizationImage(organization.id, imageData));
    }
  };

  copyCode = () => {
    // @ts-ignore
    const { dispatch, t, organization } = this.props;
    copyText(t('codeCopyText', { code: organization.community_code }));
    dispatch(trackActionWithoutData(ACTIONS.COPY_CODE));
  };

  copyUrl = () => {
    // @ts-ignore
    const { dispatch, t, organization } = this.props;

    const url = getCommunityUrl(organization.community_url);
    const code = organization.community_code;

    copyText(t('groupsMembers:sendInviteMessage', { url, code }));
    dispatch(trackActionWithoutData(ACTIONS.COPY_INVITE_URL));
  };

  // @ts-ignore
  navigateBack = () => this.props.dispatch(navigateBack());

  // @ts-ignore
  handleChangeName = t => this.setState({ name: t });

  handleNewCode = () => {
    // @ts-ignore
    const { t, dispatch, organization } = this.props;
    Alert.alert(t('createNewCode'), t('cannotBeUndone'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('yes'),
        onPress: () => {
          dispatch(generateNewCode(organization.id));
        },
      },
    ]);
  };

  handleNewLink = () => {
    // @ts-ignore
    const { t, dispatch, organization } = this.props;
    Alert.alert(t('createNewLink'), t('cannotBeUndone'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('yes'),
        onPress: () => {
          dispatch(generateNewLink(organization.id));
        },
      },
    ]);
  };

  deleteOrg = async () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    await dispatch(deleteOrganization(organization.id));
    dispatch(navigateToMainTabs(COMMUNITIES_TAB));
  };

  checkDeleteOrg = () => {
    // @ts-ignore
    const { t } = this.props;
    Alert.alert(t('deleteCommunity'), t('cannotBeUndone'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: this.deleteOrg,
      },
    ]);
  };

  handleEdit = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;

    if (this.state.editing) {
      this.save();
      this.setState({ editing: false });
      dispatch(trackScreenChange(['community', 'detail']));
    } else {
      this.setState({ editing: true, name: organization.name });
      dispatch(trackScreenChange(['community', 'detail', 'edit']));
      dispatch(trackActionWithoutData(ACTIONS.COMMUNITY_EDIT));
    }
  };

  // @ts-ignore
  handleImageChange = data => this.setState({ imageData: data });

  renderImage() {
    // @ts-ignore
    const { organization } = this.props;
    const { editing, imageData } = this.state;
    const image = organization.community_photo_url;

    const content = (
      <Flex align="center" justify="center" style={styles.imageWrap}>
        {image || imageData ? (
          <Image
            resizeMode="cover"
            // @ts-ignore
            source={{ uri: imageData ? imageData.uri : image }}
            style={styles.image}
          />
        ) : null}
        {editing ? (
          <Flex style={styles.absoluteCenter} align="center" justify="center">
            <Image source={CAMERA_ICON} />
          </Flex>
        ) : null}
      </Flex>
    );
    if (editing) {
      return (
        // @ts-ignore
        <ImagePicker onSelectImage={this.handleImageChange}>
          {content}
        </ImagePicker>
      );
    }
    return content;
  }

  render() {
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      organization,
      // @ts-ignore
      membersLength,
      // @ts-ignore
      owner,
      // @ts-ignore
      canEdit,
      // @ts-ignore
      analyticsPermissionType,
    } = this.props;
    const { editing, name } = this.state;
    return (
      // @ts-ignore
      <View flex={1}>
        <Analytics
          screenName={['community', 'detail']}
          screenContext={{
            [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
          }}
        />
        {/* 
        // @ts-ignore */}
        <View style={styles.container} forceInset={{ bottom: 'never' }}>
          <Header
            left={
              <IconButton
                name="deleteIcon"
                type="MissionHub"
                style={styles.closeButton}
                onPress={this.navigateBack}
              />
            }
            right={
              !canEdit ? null : (
                <Button
                  style={styles.editBtn}
                  buttonTextStyle={styles.btnText}
                  onPress={this.handleEdit}
                  text={(editing ? t('done') : t('edit')).toUpperCase()}
                  type="transparent"
                />
              )
            }
          />
        </View>
        <View style={styles.content}>
          {this.renderImage()}
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
            {editing ? (
              <Flex direction="row" align="center" style={styles.rowWrap}>
                <Input
                  onChangeText={this.handleChangeName}
                  value={name}
                  autoFocus={true}
                  autoCorrect={true}
                  selectionColor={theme.white}
                  returnKeyType="done"
                  style={styles.input}
                  blurOnSubmit={true}
                  underlineColorAndroid={theme.transparent}
                />
                <PopupMenu
                  // @ts-ignore
                  actions={[
                    {
                      text: t('delete'),
                      onPress: this.checkDeleteOrg,
                      destructive: true,
                    },
                  ]}
                  iconProps={{ size: 20, style: styles.menu }}
                />
              </Flex>
            ) : (
              <Flex direction="row" align="center" style={styles.rowWrap}>
                <Text style={styles.name}>{organization.name}</Text>
              </Flex>
            )}
            <Flex direction="row" align="center" style={styles.rowWrap}>
              <Flex value={1} direction="column">
                <Text style={styles.label}>{t('profileLabels.owner')}</Text>
                <Text style={styles.text}>{owner.full_name}</Text>
              </Flex>
              <Flex value={1} direction="column">
                <Text style={styles.label}>{t('created')}</Text>
                <DateComponent
                  style={styles.text}
                  date={organization.created_at}
                  format="LL"
                />
              </Flex>
            </Flex>
            <Flex direction="row" align="center" style={styles.rowWrap}>
              <Flex direction="column">
                <Text style={styles.label}>{t('members')}</Text>
                <Text style={styles.text}>{membersLength}</Text>
              </Flex>
            </Flex>
            <Separator style={styles.separator} />
            <Flex direction="row" align="center" style={styles.rowWrap}>
              <Flex value={1} direction="column">
                <Text style={styles.label}>{t('code')}</Text>
                <Text style={styles.codeText}>
                  {organization.community_code}
                </Text>
              </Flex>
              {editing ? (
                <Button
                  style={[styles.btn, styles.newBtn]}
                  buttonTextStyle={styles.btnText}
                  onPress={this.handleNewCode}
                  text={t('newCode').toUpperCase()}
                  type="transparent"
                />
              ) : (
                <Button
                  style={styles.btn}
                  buttonTextStyle={styles.btnText}
                  onPress={this.copyCode}
                  text={t('copy').toUpperCase()}
                  type="transparent"
                />
              )}
            </Flex>
            <Separator style={styles.separator} />
            <Flex direction="row" align="center" style={styles.rowWrap}>
              <Flex value={1} direction="column">
                <Text style={styles.label}>{t('link')}</Text>
                <Text style={styles.linkText}>
                  {getCommunityUrl(organization.community_url)}
                </Text>
              </Flex>
              {editing ? (
                <Button
                  style={[styles.btn, styles.newBtn]}
                  buttonTextStyle={styles.btnText}
                  onPress={this.handleNewLink}
                  text={t('newLink').toUpperCase()}
                  type="transparent"
                />
              ) : (
                <Button
                  style={styles.btn}
                  buttonTextStyle={styles.btnText}
                  onPress={this.copyUrl}
                  text={t('copy').toUpperCase()}
                  type="transparent"
                />
              )}
            </Flex>
            <Separator style={styles.separator} />
            <Flex direction="row" align="center" style={styles.rowWrap}>
              <Text style={styles.info}>{t('info')}</Text>
            </Flex>
          </ScrollView>
        </View>
      </View>
    );
  }
}

// @ts-ignore
GroupProfile.propTypes = {
  organization: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = ({ auth, organizations }, { navigation }) => {
  const { organization = {} } = navigation.state.params || {};
  const orgId = organization.id;

  const selectorOrg =
    organizationSelector({ organizations }, { orgId }) || organization;
  const { members = [], contactReport = {} } = selectorOrg;
  // @ts-ignore
  const owner = members.find(({ organizational_permissions = [] }) =>
    organizational_permissions.find(
      orgPermission =>
        // @ts-ignore
        orgPermission.organization_id === orgId && isOwner(orgPermission),
    ),
  );
  // @ts-ignore
  const myOrgPerm = orgPermissionSelector(null, {
    person: auth.person,
    organization: { id: orgId },
  });
  return {
    membersLength: contactReport.memberCount || 0,
    owner: owner || {},
    organization: selectorOrg,
    canEdit:
      isOwner(myOrgPerm) ||
      (!orgIsUserCreated(selectorOrg) && isAdminOrOwner(myOrgPerm)),
    analyticsPermissionType: getAnalyticsPermissionType(auth, organization),
  };
};

export default connect(mapStateToProps)(GroupProfile);
export const GROUP_PROFILE = 'nav/GROUP_PROFILE';
