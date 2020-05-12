import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Button } from '../common';
import ItemHeaderText from '../ItemHeaderText/index';
import { navToPersonScreen } from '../../actions/person';
import { CommunityPerson } from '../CommunityFeedItem/__generated__/CommunityPerson';

import styles from './styles';

export interface CommunityFeedItemNameProps {
  name: string | null;
  person?: CommunityPerson | null;
  communityId: string;
  pressable: boolean;
  customContent?: JSX.Element;
}

export const CommunityFeedItemName = ({
  name,
  person,
  communityId,
  pressable,
  customContent,
}: CommunityFeedItemNameProps) => {
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();

  const onPressNameLink = () =>
    person && dispatch(navToPersonScreen(person, { id: communityId }));

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
