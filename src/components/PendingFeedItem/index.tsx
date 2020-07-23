import React from 'react';
import { View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { Card, Touchable, Icon } from '../common';
import { RootState } from '../../reducers';
import { StoredPost } from '../../reducers/communityPosts';

import styles from './styles';

interface PendingFeedItemProps {
  pendingItemId: string;
}

export const PendingFeedItem = ({ pendingItemId }: PendingFeedItemProps) => {
  const { media }: StoredPost = useSelector(
    ({ communityPosts }: RootState) =>
      communityPosts.pendingPosts[pendingItemId],
  );

  const handleRetry = () => {};

  const handleCancel = () => {};

  return (
    <Card testID="PendingFeedItem" style={styles.container}>
      <Image style={{ height: 48, width: 48 }} source={{ uri: media }} />
    </Card>
  );
};
