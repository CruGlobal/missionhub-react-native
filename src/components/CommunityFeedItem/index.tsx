import React from 'react';
import { View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import i18n from 'i18next';

import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { Card, Touchable, Icon } from '../common';
import { CommunityFeedItemContent } from '../CommunityFeedItemContent';
import {
  CREATE_POST_SCREEN,
  CreatePostScreenNavParams,
} from '../../containers/Groups/CreatePostScreen';
import { useIsMe } from '../../utils/hooks/useIsMe';
import {
  CommunityFeedItem as FeedItemFragment,
  CommunityFeedItem_subject,
  CommunityFeedItem_subject_Post as PostSubject,
} from '../CommunityFeedItem/__generated__/CommunityFeedItem';
import { FEED_ITEM_DETAIL_SCREEN } from '../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import { canModifyFeedItemSubject, copyText } from '../../utils/common';

import styles from './styles';
import { DeletePost, DeletePostVariables } from './__generated__/DeletePost';
import { DELETE_POST, REPORT_POST } from './queries';
import { ReportPost, ReportPostVariables } from './__generated__/ReportPost';

interface CommunityFeedItemProps {
  feedItem: FeedItemFragment;
  namePressable: boolean;
  postTypePressable?: boolean;
  onClearNotification?: (item: FeedItemFragment) => void;
  onEditPost: () => void;
}

export function useDeleteFeedItem(
  feedItem?: FeedItemFragment,
  onDelete?: () => void,
) {
  const [deletePost] = useMutation<DeletePost, DeletePostVariables>(
    DELETE_POST,
    {
      onCompleted: () => onDelete && onDelete(),
    },
  );

  function deleteFeedItem(onComplete?: () => void) {
    Alert.alert(
      i18n.t('communityFeedItems:delete.title'),
      i18n.t('communityFeedItems:delete.message'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          style: 'destructive',
          text: i18n.t('communityFeedItems:delete.buttonText'),
          onPress: async () => {
            await deletePost({
              variables: { id: feedItem?.subject.id as string },
            });
            onComplete && onComplete();
          },
        },
      ],
    );
  }
  return deleteFeedItem;
}

export function useEditFeedItem(
  subject?: CommunityFeedItem_subject,
  communityId?: string,
  onComplete?: () => void,
) {
  const dispatch = useDispatch();

  function editFeedItem() {
    dispatch(
      navigatePush(CREATE_POST_SCREEN, {
        post: subject,
        communityId,
        onComplete,
      } as CreatePostScreenNavParams),
    );
  }
  return editFeedItem;
}

export const CommunityFeedItem = ({
  feedItem,
  namePressable,
  postTypePressable = true,
  onClearNotification,
  onEditPost,
}: CommunityFeedItemProps) => {
  const { subject, subjectPerson, community } = feedItem;
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();
  const isMe = useIsMe(subjectPerson?.id || '');

  const [reportPost] = useMutation<ReportPost, ReportPostVariables>(
    REPORT_POST,
  );

  const isGlobal = !feedItem.community;

  if (
    subject.__typename !== 'Post' &&
    subject.__typename !== 'AcceptedCommunityChallenge' &&
    subject.__typename !== 'Step' &&
    subject.__typename !== 'CommunityPermission'
  ) {
    throw new Error(
      'Subject type of FeedItem must be Post, AcceptedCommunityChallenge, CommunityPermission, or Step',
    );
  }
  const deleteFeedItem = useDeleteFeedItem(feedItem, onEditPost);
  const editFeedItem = useEditFeedItem(subject, community?.id, onEditPost);

  const isPost = (subject: CommunityFeedItem_subject): subject is PostSubject =>
    subject.__typename === 'Post';
  const canModify = canModifyFeedItemSubject(subject);
  const hasSubjectContent =
    isPost(subject) && (subject as PostSubject).content != '';

  const handlePress = () =>
    dispatch(
      navigatePush(FEED_ITEM_DETAIL_SCREEN, {
        feedItemId: feedItem.id,
      }),
    );

  const clearNotification = () =>
    onClearNotification && onClearNotification(feedItem);

  const handleReport = () =>
    Alert.alert(t('report.title'), t('report.message'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('report.confirmButtonText'),
        onPress: () => reportPost({ variables: { id: subject.id } }),
      },
    ]);

  const handleCopyPost = () =>
    isPost(subject) && hasSubjectContent && copyText(subject.content);

  const copyAction = [{ text: t('copy.buttonText'), onPress: handleCopyPost }];
  const meActions = [
    { text: t('edit.buttonText'), onPress: editFeedItem },
    {
      text: t('delete.buttonText'),
      onPress: () => deleteFeedItem(),
      destructive: true,
    },
  ];
  const notMeActions = [
    { text: t('report.buttonText'), onPress: handleReport },
  ];

  const menuActions =
    !isGlobal && isPost(subject)
      ? [
          ...(hasSubjectContent ? copyAction : []),
          ...(isMe && canModify ? meActions : notMeActions),
        ]
      : [];

  const renderClearNotificationButton = () => (
    <View style={styles.clearNotificationWrap}>
      <Touchable
        testID="ClearNotificationButton"
        onPress={clearNotification}
        style={styles.clearNotificationTouchable}
      >
        <Icon
          name="deleteIcon"
          type="MissionHub"
          size={10}
          style={styles.clearNotificationIcon}
        />
      </Touchable>
    </View>
  );

  const renderContent = () => (
    <View style={styles.cardContent}>
      <CommunityFeedItemContent
        feedItem={feedItem}
        namePressable={namePressable}
        postLabelPressable={postTypePressable}
      />
      {onClearNotification ? renderClearNotificationButton() : null}
    </View>
  );

  const renderCardGlobal = () => (
    <Card testID="CommunityFeedItem">{renderContent()}</Card>
  );

  const renderCardLongPressable = () => (
    <Card>
      <View style={{ flex: 1 }}>
        <PopupMenu
          testID="CommunityFeedItem"
          actions={menuActions}
          buttonProps={{
            onPress: handlePress,
            style: { flex: 1 },
          }}
          triggerOnLongPress={true}
        >
          {renderContent()}
        </PopupMenu>
      </View>
    </Card>
  );

  const renderCardPressable = () => (
    <Card testID="CommunityFeedItem" onPress={handlePress}>
      {renderContent()}
    </Card>
  );

  return isGlobal
    ? renderCardGlobal()
    : menuActions.length
    ? renderCardLongPressable()
    : renderCardPressable();
};
