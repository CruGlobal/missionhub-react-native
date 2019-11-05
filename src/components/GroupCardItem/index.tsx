import React from 'react';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text, Flex, Card, Button, Icon } from '../common';
import DEFAULT_MISSIONHUB_IMAGE from '../../../assets/images/impactBackground.png';
import GLOBAL_COMMUNITY_IMAGE from '../../../assets/images/globalCommunityImage.png';
import Dot from '../Dot';
import { getFirstNameAndLastInitial, orgIsGlobal } from '../../utils/common';
import { TouchablePress } from '../Touchable/index.ios';

import styles from './styles';

export interface GroupCardItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  group: any;
  // group: { // This should be an org type once that is set up
  //   id?: string;
  //   name: string;
  //   unread_comments_count: number;
  //   owner?: { first_name?: string; last_name?: string };
  //   contactReport?: {
  //     contactsCount?: number;
  //     unassignedCount?: number;
  //     memberCount?: number;
  //   };
  //   user_created?: boolean;
  //   community_photo_url?: string;
  // };
  onPress?: TouchablePress;
  onJoin?: TouchablePress;
  testID?: string;
}

const GroupCardItem = ({ group, onPress, onJoin }: GroupCardItemProps) => {
  const { t } = useTranslation('groupItem');

  const {
    report: { contactCount = 0, unassignedCount = 0, memberCount = 0 } = {},
    owner,
    userCreated,
    communityPhotoUrl,
    unreadCommentsCount,
    name,
  } = group;

  const handlePress = () => {
    onPress && onPress(group);
  };
  const handleJoin = () => {
    onJoin && onJoin(group);
  };
  function renderInfo() {
    if (onJoin) {
      return (
        <Text style={styles.groupNumber}>
          {owner
            ? t('owner', {
                name: getFirstNameAndLastInitial(
                  owner.firstName,
                  owner.lastName,
                ),
              })
            : userCreated
            ? t('privateGroup')
            : ''}
        </Text>
      );
    }
    if (userCreated) {
      return (
        <Text style={styles.groupNumber}>
          {t('numMembers', { count: memberCount })}
        </Text>
      );
    }
    return (
      <Text style={styles.groupNumber}>
        {t('numContacts', { count: contactCount })}
        <Dot />
        {t('numUnassigned', { count: unassignedCount })}
      </Text>
    );
  }
  function getSource() {
    if (communityPhotoUrl) {
      return { uri: communityPhotoUrl };
    } else if (orgIsGlobal(group)) {
      return GLOBAL_COMMUNITY_IMAGE;
    } else if (userCreated) {
      return undefined;
    } else {
      return DEFAULT_MISSIONHUB_IMAGE;
    }
  }
  const source = getSource();
  const isGlobal = orgIsGlobal(group);
  const hasNotification = !isGlobal && unreadCommentsCount !== 0;

  //not passing a value for onPress to Card makes the card unclickable.
  //In some cases we want to prevent clicking on GroupCardItem.
  return (
    <Card
      testID="CardButton"
      onPress={onPress ? handlePress : undefined}
      style={styles.card}
    >
      <Flex
        value={1}
        style={[
          styles.content,
          userCreated && !isGlobal ? styles.userCreatedContent : undefined,
        ]}
      >
        {source ? (
          <Image source={source} resizeMode="cover" style={styles.image} />
        ) : null}
        <Flex justify="center" direction="row" style={styles.infoWrap}>
          <Flex value={1}>
            <Text style={styles.groupName}>{name.toUpperCase()}</Text>
            {renderInfo()}
          </Flex>
          {onJoin ? (
            <Flex direction="column" justify="center">
              <Button
                testID="JoinButton"
                type="transparent"
                style={[styles.joinButton]}
                buttonTextStyle={styles.joinButtonText}
                text={t('join').toUpperCase()}
                onPress={handleJoin}
              />
            </Flex>
          ) : null}
          {!onJoin && hasNotification ? (
            <Flex align="center" justify="center">
              <Icon
                type="MissionHub"
                name="bellIcon"
                size={20}
                style={styles.notificationIcon}
              />
              <View style={styles.badge} />
            </Flex>
          ) : null}
        </Flex>
      </Flex>
    </Card>
  );
};

export default GroupCardItem;
