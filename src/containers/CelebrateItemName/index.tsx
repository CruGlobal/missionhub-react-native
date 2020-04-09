import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux-legacy';

import { Button } from '../../components/common';
import ItemHeaderText from '../../components/ItemHeaderText/index';
import { navToPersonScreen } from '../../actions/person';

import styles from './styles';

export interface CommunityFeedItemNameProps {
  name: string | null;
  personId: string | null;
  orgId: string;
  pressable: boolean;
  customContent?: JSX.Element;
}

export const CommunityFeedItemName = ({
  name,
  personId,
  orgId,
  pressable,
  customContent,
}: CommunityFeedItemNameProps) => {
  const { t } = useTranslation('celebrateFeeds');
  const dispatch = useDispatch();

  const onPressNameLink = () =>
    personId && dispatch(navToPersonScreen({ id: personId }, { id: orgId }));

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
