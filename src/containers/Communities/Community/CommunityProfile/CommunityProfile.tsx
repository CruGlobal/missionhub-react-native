/* eslint-disable max-lines */

import React, { useState } from 'react';
import { View, Alert, Image, ScrollView, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useNavigationParam } from 'react-navigation-hooks';

import {
  Flex,
  Input,
  Button,
  Separator,
  IconButton,
  DateComponent,
} from '../../../../components/common';
import CAMERA_ICON from '../../../../../assets/images/cameraIcon.png';
import ImagePicker from '../../../../components/ImagePicker';
import theme from '../../../../theme';
import {
  copyText,
  getCommunityUrl,
  canEditCommunity,
} from '../../../../utils/common';
import {
  navigateBack,
  navigateToMainTabs,
} from '../../../../actions/navigation';
import {
  updateOrganization,
  updateOrganizationImage,
  deleteOrganization,
  generateNewCode,
  generateNewLink,
  ImageData,
} from '../../../../actions/organizations';
import {
  trackActionWithoutData,
  trackScreenChange,
} from '../../../../actions/analytics';
import { ACTIONS, COMMUNITIES_TAB } from '../../../../constants';
import PopupMenu from '../../../../components/PopupMenu';
import Header from '../../../../components/Header';
import { useMyId } from '../../../../utils/hooks/useIsMe';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { useCommunityPhoto } from '../../hooks/useCommunityPhoto';
import { ErrorNotice } from '../../../../components/ErrorNotice/ErrorNotice';

import styles from './styles';
import {
  CommunityProfile as CommunityProfileData,
  CommunityProfileVariables,
} from './__generated__/CommunityProfile';
import { COMMUNITY_PROFILE_QUERY } from './queries';

export const CommunityProfile = () => {
  const { t } = useTranslation('communityProfile');
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [imageData, setImageData] = useState<ImageData | null>(null);

  const communityId: string = useNavigationParam('communityId');
  const myId = useMyId();

  const { data, error, refetch } = useQuery<
    CommunityProfileData,
    CommunityProfileVariables
  >(COMMUNITY_PROFILE_QUERY, {
    variables: { communityId, myId },
  });

  const permission =
    data?.community.people.edges[0].communityPermission.permission;

  useAnalytics(['community', 'detail']);

  const save = async () => {
    const didNameChange = name !== data?.community.name;
    if (!didNameChange && !imageData) {
      // Nothing changed, don't update
      return;
    }
    if (didNameChange) {
      await dispatch(updateOrganization(communityId, { name }));
    }
    if (imageData) {
      await dispatch(updateOrganizationImage(communityId, imageData));
    }
    await refetch();
    setImageData(null);
  };

  const copyCode = () => {
    copyText(t('codeCopyText', { code: data?.community.communityCode }));
    dispatch(trackActionWithoutData(ACTIONS.COPY_CODE));
  };

  const copyUrl = () => {
    const url = getCommunityUrl(data?.community.communityUrl);
    const code = data?.community.communityCode;

    copyText(t('groupsMembers:sendInviteMessage', { url, code }));
    dispatch(trackActionWithoutData(ACTIONS.COPY_INVITE_URL));
  };

  const handleChangeName = (name: string) => setName(name);

  const handleNewCode = () => {
    Alert.alert(t('createNewCode'), t('cannotBeUndone'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('yes'),
        onPress: async () => {
          await dispatch(generateNewCode(communityId));
          refetch();
        },
      },
    ]);
  };

  const handleNewLink = () => {
    Alert.alert(t('createNewLink'), t('cannotBeUndone'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('yes'),
        onPress: async () => {
          await dispatch(generateNewLink(communityId));
          refetch();
        },
      },
    ]);
  };

  const deleteOrg = async () => {
    await dispatch(deleteOrganization(communityId));
    dispatch(navigateToMainTabs(COMMUNITIES_TAB));
  };

  const checkDeleteOrg = () => {
    Alert.alert(t('deleteCommunity'), t('cannotBeUndone'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: deleteOrg,
      },
    ]);
  };

  const handleEdit = () => {
    if (editing) {
      save();
      setEditing(false);
      dispatch(trackScreenChange(['community', 'detail']));
    } else {
      setEditing(true);
      setName(data?.community.name ?? '');
      dispatch(trackScreenChange(['community', 'detail', 'edit']));
      dispatch(trackActionWithoutData(ACTIONS.COMMUNITY_EDIT));
    }
  };

  const handleImageChange = (data: ImageData) => setImageData(data);

  const communityPhotoSource = useCommunityPhoto(
    communityId,
    data?.community.communityPhotoUrl,
  );

  const renderImage = () => {
    const image = data?.community.communityPhotoUrl;

    const content = (
      <Flex align="center" justify="center" style={styles.imageWrap}>
        {image || imageData ? (
          <Image
            resizeMode="cover"
            source={imageData ? { uri: imageData.uri } : communityPhotoSource}
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
        <ImagePicker onSelectImage={handleImageChange}>{content}</ImagePicker>
      );
    }
    return content;
  };

  const canEdit = canEditCommunity(permission);

  const owner = data?.community.owners.nodes[0];

  return (
    <>
      <View style={styles.container}>
        <Header
          left={
            <IconButton
              testID="backButton"
              name="deleteIcon"
              type="MissionHub"
              style={styles.closeButton}
              onPress={() => dispatch(navigateBack())}
            />
          }
          right={
            !canEdit ? null : (
              <Button
                testID="editButton"
                style={styles.editBtn}
                buttonTextStyle={styles.btnText}
                onPress={handleEdit}
                text={(editing ? t('done') : t('edit')).toUpperCase()}
                type="transparent"
              />
            )
          }
        />
      </View>
      <ErrorNotice
        message={t('errorLoadingCommunityDetails')}
        error={error}
        refetch={refetch}
      />
      <View style={styles.content}>
        {renderImage()}
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
          {editing ? (
            <Flex direction="row" align="center" style={styles.rowWrap}>
              <Input
                testID="nameInput"
                onChangeText={handleChangeName}
                value={name}
                autoFocus={true}
                autoCorrect={true}
                selectionColor={theme.white}
                returnKeyType="done"
                style={styles.input}
                blurOnSubmit={true}
                underlineColorAndroid={theme.transparent}
                maxLength={44}
              />
              <PopupMenu
                actions={[
                  {
                    text: t('delete'),
                    onPress: checkDeleteOrg,
                    destructive: true,
                  },
                ]}
                iconProps={{ size: 20, style: styles.menu }}
              />
            </Flex>
          ) : (
            <Flex direction="row" align="center" style={styles.rowWrap}>
              <Text style={styles.name}>{data?.community.name}</Text>
            </Flex>
          )}
          <Flex direction="row" align="center" style={styles.rowWrap}>
            <Flex value={1} direction="column">
              <Text style={styles.label}>{t('profileLabels.owner')}</Text>
              <Text style={styles.text}>{owner?.fullName}</Text>
            </Flex>
            <Flex value={1} direction="column">
              <Text style={styles.label}>{t('created')}</Text>
              {data?.community.createdAt ? (
                <DateComponent
                  style={styles.text}
                  date={data?.community.createdAt}
                  format="LL"
                />
              ) : null}
            </Flex>
          </Flex>
          <Flex direction="row" align="center" style={styles.rowWrap}>
            <Flex direction="column">
              <Text style={styles.label}>{t('members')}</Text>
              <Text style={styles.text}>
                {data?.community.report.memberCount}
              </Text>
            </Flex>
          </Flex>
          <Separator style={styles.separator} />
          <Flex direction="row" align="center" style={styles.rowWrap}>
            <Flex value={1} direction="column">
              <Text style={styles.label}>{t('code')}</Text>
              <Text style={styles.codeText}>
                {data?.community.communityCode}
              </Text>
            </Flex>
            {editing ? (
              <Button
                testID="newCodeButton"
                style={[styles.btn, styles.newBtn]}
                buttonTextStyle={styles.btnText}
                onPress={handleNewCode}
                text={t('newCode').toUpperCase()}
                type="transparent"
              />
            ) : (
              <Button
                testID="copyCodeButton"
                style={styles.btn}
                buttonTextStyle={styles.btnText}
                onPress={copyCode}
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
                {getCommunityUrl(data?.community.communityUrl)}
              </Text>
            </Flex>
            {editing ? (
              <Button
                testID="newUrlButton"
                style={[styles.btn, styles.newBtn]}
                buttonTextStyle={styles.btnText}
                onPress={handleNewLink}
                text={t('newLink').toUpperCase()}
                type="transparent"
              />
            ) : (
              <Button
                testID="copyUrlButton"
                style={styles.btn}
                buttonTextStyle={styles.btnText}
                onPress={copyUrl}
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
    </>
  );
};

export const COMMUNITY_PROFILE = 'nav/COMMUNITY_PROFILE';
