import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Button } from '../common';
import ItemHeaderText from '../ItemHeaderText/index';
import { navToPersonScreen } from '../../actions/person';

import styles from './styles';

export interface CommunityFeedItemNameProps {
  name: string | null;
  personId?: string;
  pressable: boolean;
  customContent?: JSX.Element;
}

export const CommunityFeedItemName = ({
  name,
  personId,
  pressable,
  customContent,
}: CommunityFeedItemNameProps) => {
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();

  const onPressNameLink = () =>
    personId && dispatch(navToPersonScreen(personId));

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
