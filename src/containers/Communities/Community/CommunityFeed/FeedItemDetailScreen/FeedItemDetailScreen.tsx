import React, { useRef, useState } from 'react';
import { View, SafeAreaView, FlatList } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
// import { useSelector } from 'react-redux';

import CommentsList from '../../../../CommentsList';
import { CommunityFeedItemContent } from '../../../../../components/CommunityFeedItemContent';
import {
  RefreshControl,
  Text,
  Separator,
} from '../../../../../components/common';
import {
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_PERMISSION_TYPE,
} from '../../../../../constants';
// import {
//   getAnalyticsAssignmentType,
//   getAnalyticsPermissionType,
// } from '../../../../../utils/analytics';
import { useKeyboardListeners } from '../../../../../utils/hooks/useKeyboardListeners';
import { useAnalytics } from '../../../../../utils/hooks/useAnalytics';
import BackButton from '../../../../../components/BackButton';
import Header from '../../../../../components/Header';
import { ErrorNotice } from '../../../../../components/ErrorNotice/ErrorNotice';
// import { RootState } from '../../../../../reducers';
import { PermissionEnum } from '../../../../../../__generated__/globalTypes';
import { useMyId } from '../../../../../utils/hooks/useIsMe';
import { FooterLoading } from '../../../../../components/FooterLoading';
import { FeedItemCommentItem } from '../../../../CommentItem/__generated__/FeedItemCommentItem';

import FeedCommentBox from './FeedCommentBox';
import styles from './styles';
import { FEED_ITEM_DETAIL_QUERY } from './queries';
import {
  FeedItemDetail,
  FeedItemDetailVariables,
} from './__generated__/FeedItemDetail';

const FeedItemDetailScreen = () => {
  const { t } = useTranslation('feedItemDetail');

  // const analyticsAssignmentType = useSelector(({ auth }: RootState) =>
  //   getAnalyticsAssignmentType(subjectPerson, auth, organization),
  // );
  // const analyticsPermissionType = useSelector(({ auth }: RootState) =>
  //   getAnalyticsPermissionType(auth, organization),
  // );
  useAnalytics(['celebrate item', 'comments'], {
    screenContext: {
      [ANALYTICS_ASSIGNMENT_TYPE]: '', //analyticsAssignmentType,
      [ANALYTICS_PERMISSION_TYPE]: '', // analyticsPermissionType,
    },
  });

  const feedItemId: string = useNavigationParam('itemId');

  const [editingCommentId, setEditingCommentId] = useState<string>();

  const myId = useMyId();
  const { data, loading, error, refetch, fetchMore } = useQuery<
    FeedItemDetail,
    FeedItemDetailVariables
  >(FEED_ITEM_DETAIL_QUERY, {
    variables: { feedItemId, myId },
  });

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
      if (index && index >= 0) {
        listRef.current?.scrollToIndex({ index, viewPosition: 1 });
        return;
      }
    }
    scrollToEnd();
  };

  useKeyboardListeners({ onShow: () => scrollToFocusedRef() });

  const renderHeader = () => (
    <SafeAreaView>
      <Header
        left={<BackButton />}
        center={
          <Text style={styles.headerText}>
            {data?.feedItem.community?.name}
          </Text>
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

  const renderCommentsList = () =>
    data ? (
      <CommentsList
        feedItemId={feedItemId}
        comments={data.feedItem.comments.nodes}
        editingCommentId={editingCommentId}
        setEditingCommentId={setEditingCommentId}
        isOwner={
          data.feedItem.community?.people.edges[0].communityPermission
            .permission === PermissionEnum.owner
        }
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
              <CommunityFeedItemContent feedItem={data?.feedItem} />
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
      {renderHeader()}
      {renderCommentsList()}
      {renderCommentBox()}
    </View>
  );
};

export default FeedItemDetailScreen;
export const FEED_ITEM_DETAIL_SCREEN = 'nav/FEED_ITEM_DETAIL_SCREEN';
