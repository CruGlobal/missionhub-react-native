import React, { useRef } from 'react';
import { Image, View, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { connect } from 'react-redux-legacy';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useApolloClient } from '@apollo/react-hooks';

import { CommentLikeComponent } from '../../components/CommentLikeComponent';
import { organizationSelector } from '../../selectors/organizations';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';
import theme from '../../theme';
import TRAILS1 from '../../../assets/images/Trailss.png';
import TRAILS2 from '../../../assets/images/TrailGrey.png';
import { reloadCelebrateComments } from '../../actions/celebrateComments';
import { TrackStateContext } from '../../actions/analytics';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import CardTime from '../../components/CardTime';
import { CommunityFeedItemName } from '../../components/CommunityFeedItemName';
import { CommunityFeedItemContent } from '../../components/CommunityFeedItemContent';
import { RefreshControl } from '../../components/common';
import {
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_PERMISSION_TYPE,
} from '../../constants';
import { CommunityFeedItem } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../components/CommunityFeedItem/queries';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import {
  CelebrateCommentsState,
  CelebrateComment,
} from '../../reducers/celebrateComments';
import { AuthState } from '../../reducers/auth';
import {
  getAnalyticsAssignmentType,
  getAnalyticsPermissionType,
} from '../../utils/analytics';
import { useKeyboardListeners } from '../../utils/hooks/useKeyboardListeners';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';

export interface CelebrateDetailScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  organization: Organization;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  celebrateComments?: { comments: CelebrateComment[]; pagination: any };
  editingCommentId: string | null;
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
  analyticsPermissionType: TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
}

const CelebrateDetailScreen = ({
  dispatch,
  organization,
  celebrateComments,
  editingCommentId,
  analyticsAssignmentType,
  analyticsPermissionType,
}: CelebrateDetailScreenProps) => {
  useAnalytics(['celebrate item', 'comments'], {
    screenContext: {
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
      [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
    },
  });
  const client = useApolloClient();
  const navParamsEvent: CommunityFeedItem = useNavigationParam('item');
  const event =
    client.readFragment<CommunityFeedItem>({
      id: `FeedItem:${navParamsEvent.id}`,
      fragment: COMMUNITY_FEED_ITEM_FRAGMENT,
      fragmentName: 'CommunityFeedItem',
    }) || navParamsEvent;
  const onRefreshCelebrateItem: () => void = useNavigationParam(
    'onRefreshCelebrateItem',
  );

  const listRef = useRef<FlatList<CelebrateComment>>(null);

  const scrollToEnd = () => listRef.current && listRef.current.scrollToEnd();

  const scrollToFocusedRef = () => {
    if (editingCommentId) {
      const index =
        celebrateComments &&
        celebrateComments.comments.findIndex(c => c.id === editingCommentId);
      if (index && index >= 0) {
        listRef.current &&
          listRef.current.scrollToIndex({ index, viewPosition: 1 });
        return;
      }
    }
    scrollToEnd();
  };

  useKeyboardListeners({ onShow: () => scrollToFocusedRef() });

  const refreshComments = () => {
    return dispatch(reloadCelebrateComments(event.id, organization.id));
  };

  const { isRefreshing, refresh } = useRefreshing(refreshComments);

  const renderHeader = () => (
    <SafeAreaView>
      <StatusBar {...theme.statusBar.darkContent} />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <CommunityFeedItemName
              name={event.subjectPersonName}
              personId={event.subjectPerson?.id}
              orgId={organization.id}
              pressable={true}
            />
            <CardTime date={event.createdAt} />
          </View>
          <CommentLikeComponent
            item={event}
            orgId={organization.id}
            onRefresh={onRefreshCelebrateItem}
            isPrayer={false} //TODO: use CommunityFeedItem props to determine this
          />
          <BackButton
            style={styles.backButtonStyle}
            iconStyle={styles.backButtonIconStyle}
            customIcon="deleteIcon"
          />
        </View>
      </View>
    </SafeAreaView>
  );

  const renderCommentsList = () => (
    <View style={styles.contentContainer}>
      <Image source={TRAILS1} style={styles.trailsTop} />
      <Image source={TRAILS2} style={styles.trailsBottom} />
      <CommentsList
        //@ts-ignore
        event={event} //TODO: Modify to use CommunityFeedItem type
        organization={organization}
        listProps={{
          ref: listRef,
          refreshControl: (
            <RefreshControl
              testID="RefreshControl"
              refreshing={isRefreshing}
              onRefresh={refresh}
            />
          ),
          ListHeaderComponent: () => (
            <CommunityFeedItemContent
              item={event}
              itemType={FeedItemSubjectTypeEnum.STORY} //TODO: use CommunityFeedItem props to determine this
              organization={organization}
              style={styles.itemContent}
            />
          ),
        }}
      />
    </View>
  );

  const renderCommentBox = () => (
    <CelebrateCommentBox
      //@ts-ignore
      event={event} //TODO: Modify to use CommunityFeedItem type
      onAddComplete={scrollToEnd}
      organization={organization}
    />
  );

  return (
    <View style={styles.pageContainer}>
      {renderHeader()}
      {renderCommentsList()}
      {renderCommentBox()}
    </View>
  );
};

const mapStateToProps = (
  {
    auth,
    organizations,
    celebrateComments,
  }: {
    auth: AuthState;
    organizations: OrganizationsState;
    celebrateComments: CelebrateCommentsState;
  },
  {
    navigation: {
      state: {
        params: { event, orgId },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const { subjectPerson } = event as CommunityFeedItem;
  const organization = organizationSelector({ organizations }, { orgId });

  return {
    organization,
    celebrateComments: celebrateCommentsSelector(
      { celebrateComments },
      { eventId: event.id },
    ),
    editingCommentId: celebrateComments.editingCommentId,
    analyticsAssignmentType: getAnalyticsAssignmentType(
      subjectPerson,
      auth,
      organization,
    ),
    analyticsPermissionType: getAnalyticsPermissionType(auth, organization),
  };
};

export default connect(mapStateToProps)(CelebrateDetailScreen);
export const CELEBRATE_DETAIL_SCREEN = 'nav/CELEBRATE_DETAIL_SCREEN';
