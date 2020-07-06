import React, { useRef, useState } from 'react';
import { View, SafeAreaView, FlatList, StatusBar } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { useDispatch } from 'react-redux';

import CommentsList from '../../../../CommentsList';
import { CommunityFeedItemContent } from '../../../../../components/CommunityFeedItemContent';
import {
  RefreshControl,
  Text,
  Separator,
  Touchable,
} from '../../../../../components/common';
import { useKeyboardListeners } from '../../../../../utils/hooks/useKeyboardListeners';
import { useAnalytics } from '../../../../../utils/hooks/useAnalytics';
import BackButton from '../../../../../components/BackButton';
import Header from '../../../../../components/Header';
import { ErrorNotice } from '../../../../../components/ErrorNotice/ErrorNotice';
import { useMyId, useIsMe } from '../../../../../utils/hooks/useIsMe';
import { FooterLoading } from '../../../../../components/FooterLoading';
import { FeedItemCommentItem } from '../../../../CommentItem/__generated__/FeedItemCommentItem';
import { CommentBoxHandles } from '../../../../../components/CommentBox';
import { navigateBack, navigatePush } from '../../../../../actions/navigation';
import { COMMUNITY_TABS } from '../../constants';
import {
  useDeleteFeedItem,
  useEditFeedItem,
} from '../../../../../components/CommunityFeedItem';
import { isOwner, isAdminOrOwner } from '../../../../../utils/common';
import theme from '../../../../../theme';

import FeedCommentBox from './FeedCommentBox';
import styles from './styles';
import { FEED_ITEM_DETAIL_QUERY } from './queries';
import {
  FeedItemDetail,
  FeedItemDetailVariables,
} from './__generated__/FeedItemDetail';

const FeedItemDetailScreen = () => {
  const feedCommentBox = useRef<CommentBoxHandles>(null);
  const { t } = useTranslation('feedItemDetail');

  const feedItemId: string = useNavigationParam('feedItemId');
  const navCommunityId: string | undefined = useNavigationParam('communityId');
  const fromNotificationCenterItem: boolean = useNavigationParam(
    'fromNotificationCenterItem',
  );
  const myId = useMyId();
  const dispatch = useDispatch();

  const { data, loading, error, refetch, fetchMore } = useQuery<
    FeedItemDetail,
    FeedItemDetailVariables
  >(FEED_ITEM_DETAIL_QUERY, {
    variables: { feedItemId, myId },
  });
  const deleteFeedItem = useDeleteFeedItem(data?.feedItem);
  const editFeedItem = useEditFeedItem(
    data?.feedItem.subject,
    data?.feedItem.community?.id,
  );

  const personId = data?.feedItem.subjectPerson?.id;
  const communityId = navCommunityId ?? data?.feedItem.community?.id;
  const readyToTrack = !!(personId && communityId);
  useAnalytics(['post', 'detail'], {
    assignmentType: { personId, communityId },
    permissionType: { communityId },
    triggerTracking: readyToTrack,
  });

  const [editingCommentId, setEditingCommentId] = useState<string>();

  const handleNextPage = () => {
    if (loading || !data?.feedItem.comments.pageInfo.hasNextPage) {
      return;
    }

    fetchMore({
      variables: {
        commentsCursor: data?.feedItem.comments.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        fetchMoreResult
          ? {
              ...prev,
              ...fetchMoreResult,
              feedItem: {
                ...prev.feedItem,
                ...fetchMoreResult.feedItem,
                comments: {
                  ...prev.feedItem.comments,
                  ...fetchMoreResult.feedItem.comments,
                  nodes: [
                    ...prev.feedItem.comments.nodes,
                    ...fetchMoreResult.feedItem.comments.nodes,
                  ],
                },
              },
            }
          : prev,
    });
  };

  const listRef = useRef<FlatList<FeedItemCommentItem[]>>(null);

  const scrollToEnd = () => listRef.current?.scrollToEnd();

  // Using useRef instead of useState since we don't need a rerender immediately when this changes.
  // Moved actual call to scrollToEnd to onContentSizeChange since new data isn't rerendered yet when this is called
  const shouldScrollToBottom = useRef(false);
  const scrollToEndAfterContentChange = () =>
    (shouldScrollToBottom.current = true);

  const scrollToFocusedRef = () => {
    if (data && editingCommentId) {
      const index = data.feedItem.comments.nodes.findIndex(
        c => c.id === editingCommentId,
      );
      if (index >= 0) {
        listRef.current?.scrollToIndex({ index, viewPosition: 1 });
        return;
      }
    }
    scrollToEnd();
  };

  useKeyboardListeners({ onShow: () => scrollToFocusedRef() });
  const communityPermission =
    data?.feedItem.community?.people.edges[0].communityPermission;
  const isMe = useIsMe(data?.feedItem.subjectPerson?.id || '');

  function handleBack() {
    fromNotificationCenterItem
      ? dispatch(navigatePush(COMMUNITY_TABS, { communityId }))
      : dispatch(navigateBack());
  }

  const renderHeader = () => (
    <SafeAreaView>
      <Header
        left={<BackButton />}
        center={
          <Touchable testID="CommunityNameHeader" onPress={handleBack}>
            <Text style={styles.headerText}>
              {data?.feedItem.community?.name}
            </Text>
          </Touchable>
        }
      />
      <Separator />
      <ErrorNotice
        message={t('errorLoadingFeedItemDetails')}
        error={error}
        refetch={refetch}
      />
    </SafeAreaView>
  );

  const menuActions = [
    ...(isMe
      ? [
          {
            text: t('communityFeedItems:edit.buttonText'),
            onPress: editFeedItem,
          },
        ]
      : []),
    ...(isMe || isAdminOrOwner(communityPermission)
      ? [
          {
            text: t('communityFeedItems:delete.buttonText'),
            onPress: () => deleteFeedItem(handleBack),
            destructive: true,
          },
        ]
      : []),
  ];

  const renderCommentsList = () =>
    data ? (
      <CommentsList
        feedItemId={feedItemId}
        comments={data.feedItem.comments.nodes}
        editingCommentId={editingCommentId}
        setEditingCommentId={setEditingCommentId}
        isOwner={isOwner(communityPermission)}
        listProps={{
          ref: listRef,
          refreshControl: (
            <RefreshControl
              testID="RefreshControl"
              refreshing={loading}
              onRefresh={refetch}
            />
          ),
          ListHeaderComponent: () => (
            <>
              <CommunityFeedItemContent
                feedItem={data?.feedItem}
                onCommentPress={() => feedCommentBox.current?.focus()}
                postLabelPressable={false}
                menuActions={menuActions}
              />
              <Separator style={styles.belowItem} />
            </>
          ),
          onEndReached: handleNextPage,
          onEndReachedThreshold: 0.2,
          ListFooterComponent: loading ? <FooterLoading /> : null,
          onContentSizeChange: debounce(() => {
            if (shouldScrollToBottom.current) {
              shouldScrollToBottom.current = false;
              scrollToEnd();
            }
          }, 10),
        }}
      />
    ) : (
      <FooterLoading />
    );

  const renderCommentBox = () =>
    data ? (
      <FeedCommentBox
        ref={feedCommentBox}
        feedItemId={data.feedItem.id}
        avatarPerson={data.currentUser.person}
        editingComment={
          editingCommentId
            ? data.feedItem.comments.nodes.find(
                ({ id }) => id === editingCommentId,
              )
            : undefined
        }
        onCancel={() => setEditingCommentId(undefined)}
        onAddComplete={
          editingCommentId ? undefined : scrollToEndAfterContentChange
        }
        onFocus={editingCommentId ? undefined : scrollToEnd}
      />
    ) : null;

  return (
    <View style={styles.pageContainer}>
      <StatusBar {...theme.statusBar.darkContent} />
      {renderHeader()}
      {renderCommentsList()}
      {renderCommentBox()}
    </View>
  );
};

export default FeedItemDetailScreen;
export const FEED_ITEM_DETAIL_SCREEN = 'nav/FEED_ITEM_DETAIL_SCREEN';
