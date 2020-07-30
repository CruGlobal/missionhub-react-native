import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReactNativeFile } from 'apollo-upload-client';

import CloseIcon from '../../../assets/images/closeIcon.svg';
import { Card, Touchable, Text } from '../common';
import { RootState } from '../../reducers';
import { StoredPost } from '../../reducers/communityPosts';
import GLOBAL_COMMUNITY_IMAGE from '../../../assets/images/globalCommunityImage.png';

import styles from './styles';

interface PendingFeedItemProps {
  pendingItemId: string;
}

export const PendingFeedItem = ({ pendingItemId }: PendingFeedItemProps) => {
  const { t } = useTranslation('pendingPost');

  const { media, failed }: StoredPost = useSelector(
    ({ communityPosts }: RootState) =>
      communityPosts.pendingPosts[pendingItemId],
  );

  /*const [thumbnailUri, setThumbnailUri] = useState<string>('');

  useEffect(() => {
    const { uri } = media instanceof ReactNativeFile ? media : { uri: '' };
    console.log(uri);
    const { path } = await RNThumbnail.get(`file://${uri}`);
    console.log(path);
    setThumbnailUri(path);
  }, []);*/

  const handleRetry = () => {};

  const handleCancel = () => {};

  const renderText = () => (
    <View style={styles.textWrapper}>
      {failed ? (
        <View>
          <Text style={styles.text}>{t('failed')}</Text>
          <Touchable onPress={handleRetry}>
            <Text>{t('tryAgain')}</Text>
          </Touchable>
        </View>
      ) : (
        <Text style={styles.text}>{t('posting')}</Text>
      )}
    </View>
  );

  const renderEnd = () =>
    failed ? (
      <Touchable onPress={handleCancel}>
        <CloseIcon />
      </Touchable>
    ) : (
      <ActivityIndicator size="small" color="rgba(0, 0, 0, 1)" />
    );

  return (
    <Card testID="PendingFeedItem" style={styles.container}>
      <Image
        style={{ height: 48, width: 48 }}
        source={GLOBAL_COMMUNITY_IMAGE}
        resizeMode={'cover'}
      />
      {renderText()}
      {renderEnd()}
    </Card>
  );
};
