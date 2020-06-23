import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Button } from '../common';
import ItemHeaderText from '../ItemHeaderText/index';
import { navigatePush } from '../../actions/navigation';
import { COMMUNITY_MEMBER_TABS } from '../../containers/Communities/Community/CommunityMembers/CommunityMember/CommunityMemberTabs';

import styles from './styles';

interface CommunityFeedItemNameProps {
  name: string | null;
  // personId and communityId are nullable to handle loading state
  personId?: string;
  communityId?: string;
  pressable: boolean;
  customContent?: JSX.Element;
}

export const CommunityFeedItemName = ({
  name,
  personId,
  communityId,
  pressable,
  customContent,
}: CommunityFeedItemNameProps) => {
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();

  const onPressNameLink = () =>
    personId &&
    communityId &&
    dispatch(
      navigatePush(COMMUNITY_MEMBER_TABS, {
        personId,
        communityId,
      }),
    );

  const content = customContent || (
    <ItemHeaderText
      text={name || t('missionHubUser')}
      style={styles.nameText}
    />
  );

  if (!name || !pressable) {
    return content;
  }

  return (
    <Button testID="NameButton" type="transparent" onPress={onPressNameLink}>
      {content}
    </Button>
  );
};
