import React from 'react';
import { Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Flex, Card, Button } from '../common';
import { getFirstNameAndLastInitial } from '../../utils/common';
import { GetCommunities_communities_nodes } from '../../containers/Groups/__generated__/GetCommunities';
import { useCommunityPhoto } from '../../containers/Communities/hooks/useCommunityPhoto';

import styles from './styles';

export interface GroupCardItemProps {
  group: GetCommunities_communities_nodes;
  onPress?: (group: GetCommunities_communities_nodes) => void;
  onJoin?: (group: GetCommunities_communities_nodes) => void;
  testID?: string;
}

const GroupCardItem = ({ group, onPress, onJoin }: GroupCardItemProps) => {
  const { t } = useTranslation('groupItem');

  const {
    name,
    communityPhotoUrl,
    // unreadCommentsCount,
    owner: {
      nodes: [owner],
    },
    report: { memberCount },
  } = group;

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
            : t('privateGroup')}
        </Text>
      );
    }
    return (
      <Text style={styles.groupNumber}>
        {t('numMembers', { count: memberCount })}
      </Text>
    );
  }

  const communityPhotoSource = useCommunityPhoto(group.id, communityPhotoUrl);

  // const hasNotification = !isGlobal && unreadCommentsCount !== 0;

  //not passing a value for onPress to Card makes the card unclickable.
  //In some cases we want to prevent clicking on GroupCardItem.

  return (
    <Card
      testID="CardButton"
      onPress={() => onPress?.(group)}
      style={styles.card}
    >
      <Flex value={1} style={styles.content}>
        <Image
          source={communityPhotoSource}
          resizeMode="cover"
          style={styles.image}
        />
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
                onPress={() => onJoin?.(group)}
              />
            </Flex>
          ) : null}
          {/* {!onJoin && hasNotification ? (
            <Flex align="center" justify="center">
              <Icon
                type="MissionHub"
                name="bellIcon"
                size={20}
                style={styles.notificationIcon}
              />
              <View style={styles.badge} />
            </Flex>
          ) : null} */}
        </Flex>
      </Flex>
    </Card>
  );
};

export default GroupCardItem;
