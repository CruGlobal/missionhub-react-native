import React, { Component } from 'react';
import { Alert, SafeAreaView, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
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
import { navigateBack, navigateReset } from '../../../actions/navigation';
import {
  updateOrganization,
  updateOrganizationImage,
  deleteOrganization,
  generateNewCode,
  generateNewLink,
} from '../../../actions/organizations';
import { trackActionWithoutData } from '../../../actions/analytics';
import { organizationSelector } from '../../../selectors/organizations';
import { ORG_PERMISSIONS, MAIN_TABS, ACTIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import PopupMenu from '../../../components/PopupMenu';

import styles from './styles';

@translate('groupProfile')
class GroupProfile extends Component {
  state = { editing: false, name: '', imageData: null };

  save = async () => {
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
      await dispatch(updateOrganizationImage(organization.id, imageData));
    }
  };

  copyCode = () => {
    copyText(this.props.organization.community_code);
    this.props.dispatch(trackActionWithoutData(ACTIONS.COPY_CODE));
  };

  copyUrl = () => {
    copyText(getCommunityUrl(this.props.organization.community_url));
    this.props.dispatch(trackActionWithoutData(ACTIONS.COPY_INVITE_URL));
  };

  navigateBack = () => this.props.dispatch(navigateBack());

  handleChangeName = t => this.setState({ name: t });

  handleNewCode = () => {
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
    const { dispatch, organization } = this.props;
    await dispatch(deleteOrganization(organization.id));
    dispatch(navigateReset(MAIN_TABS, { startTab: 'groups' }));
  };

  checkDeleteOrg = () => {
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
    if (this.state.editing) {
      this.save();
      this.setState({ editing: false });
    } else {
      this.setState({ editing: true, name: this.props.organization.name });
      this.props.dispatch(trackActionWithoutData(ACTIONS.COMMUNITY_EDIT));
    }
  };

  handleImageChange = data => this.setState({ imageData: data });

  renderImage() {
    const { organization } = this.props;
    const { editing, imageData } = this.state;
    const image = organization.community_photo_url;

    const content = (
      <Flex align="center" justify="center" style={styles.imageWrap}>
        {image || imageData ? (
          <Image
            resizeMode="cover"
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
        <ImagePicker onSelectImage={this.handleImageChange}>
          {content}
        </ImagePicker>
      );
    }
    return content;
  }

  render() {
    const { t, organization, membersLength, owner, canEdit } = this.props;
    const { editing, name } = this.state;
    return (
      <SafeAreaView style={styles.container}>
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
                actions={[
                  {
                    text: t('delete'),
                    onPress: this.checkDeleteOrg,
                    destructive: true,
                  },
                ]}
                size={20}
                iconProps={{ style: styles.menu }}
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
              <Text style={styles.codeText}>{organization.community_code}</Text>
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
        <Flex
          direction="row"
          align="center"
          style={styles.topNav}
          pointerEvents="box-none"
        >
          <Flex value={1} align="start" pointerEvents="box-none">
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          </Flex>
          {canEdit ? (
            <Flex value={1} align="end" pointerEvents="box-none">
              <Button
                style={styles.editBtn}
                buttonTextStyle={styles.btnText}
                onPress={this.handleEdit}
                text={
                  editing ? t('done').toUpperCase() : t('edit').toUpperCase()
                }
                type="transparent"
              />
            </Flex>
          ) : null}
        </Flex>
      </SafeAreaView>
    );
  }
}

GroupProfile.propTypes = {
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, organizations }, { navigation }) => {
  const { organization = {} } = navigation.state.params || {};
  const orgId = organization.id;

  const selectorOrg =
    organizationSelector({ organizations }, { orgId }) || organization;
  const { members = [], contactReport = {} } = selectorOrg;
  const owner = members.find(({ organizational_permissions = [] }) =>
    organizational_permissions.find(
      orgPermission =>
        orgPermission.organization_id === orgId &&
        orgPermission.permission_id === ORG_PERMISSIONS.OWNER,
    ),
  );
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
  };
};

export default connect(mapStateToProps)(GroupProfile);
export const GROUP_PROFILE = 'nav/GROUP_PROFILE';
