import React, { Component } from 'react';
import { SafeAreaView, Image, ScrollView } from 'react-native';
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
import { copyText } from '../../../utils/common';
import { navigateBack } from '../../../actions/navigation';
import {
  updateOrganization,
  getMyCommunities,
} from '../../../actions/organizations';
import { organizationSelector } from '../../../selectors/organizations';
import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';

import styles from './styles';

@translate('groupProfile')
class GroupProfile extends Component {
  state = { editing: false, name: '', imageData: null };

  save = () => {
    const { dispatch, organization } = this.props;
    const { imageData, name } = this.state;

    const didNameChange = name !== organization.name;
    if (!didNameChange && !imageData) {
      // Nothing changed, dont update
      return;
    }
    const data = {
      name: didNameChange ? name : undefined,
      imageData,
    };
    dispatch(updateOrganization(organization.id, data)).then(() => {
      dispatch(getMyCommunities());
    });
  };

  ref = c => (this.nameInput = c);

  copyCode = () => copyText(this.props.organization.id);

  copyUrl = () => copyText(this.props.organization.id);

  navigateBack = () => this.props.dispatch(navigateBack());

  handleChangeName = t => this.setState({ name: t });

  handleNewCode = () => {
    // TODO: Handle generating a new code
    return 'new code';
  };

  handleNewLink = () => {
    // TODO: Handle generating a new code
    return 'new link';
  };

  handleEdit = () => {
    if (this.state.editing) {
      this.save();
      this.setState({ editing: false });
    } else {
      this.setState({ editing: true, name: this.props.organization.name });
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
                ref={this.ref}
                onChangeText={this.handleChangeName}
                value={name}
                autoFocus={true}
                autoCorrect={true}
                selectionColor={theme.white}
                returnKeyType="done"
                style={styles.input}
                blurOnSubmit={true}
                placeholder=""
                underlineColorAndroid={theme.transparent}
              />
            </Flex>
          ) : (
            <Flex direction="row" align="center" style={styles.rowWrap}>
              <Text style={styles.name}>{organization.name}</Text>
            </Flex>
          )}
          <Flex direction="row" align="center" style={styles.rowWrap}>
            <Flex value={1} direction="column">
              <Text style={styles.label}>{t('owner')}</Text>
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
              <Text style={styles.codeText}>333-333</Text>
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
                https://www.missionhub.com/333333
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
  const organization = (navigation.state.params || {}).organization;
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );
  const members = (selectorOrg || {}).members || [];
  const owner = members.find(p =>
    (p.organizational_permissions || []).find(
      orgPermission =>
        orgPermission.organization_id === organization.id &&
        orgPermission.permission_id === ORG_PERMISSIONS.ADMIN,
    ),
  );
  const myOrgPerm =
    auth &&
    organization &&
    organization.id &&
    orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: organization.id },
    });
  const canEdit =
    myOrgPerm && myOrgPerm.permission_id === ORG_PERMISSIONS.ADMIN;
  return {
    membersLength: members.length,
    owner: owner || {},
    organization: selectorOrg,
    canEdit,
  };
};

export default connect(mapStateToProps)(GroupProfile);
export const GROUP_PROFILE = 'nav/GROUP_PROFILE';
