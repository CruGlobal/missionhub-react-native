import React, { useState } from 'react';
import { Alert, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { Flex, Card, Button } from '../../components/common';
import CommentItem from '../CommentItem';
import ReportItemLabel from '../../components/ReportItemLabel';
import {
  ContentComplaintResponseEnum,
  ContentComplaintSubjectTypeEnum,
} from '../../../__generated__/globalTypes';
import { CommunityFeedItemContent } from '../../components/CommunityFeedItemContent';
import { navigatePush } from '../../actions/navigation';
import { FEED_ITEM_DETAIL_SCREEN } from '../Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import { GET_NOTIFICATIONS } from '../NotificationCenterScreen/queries';

import { RESPOND_TO_CONTENT_COMPLAINT_GROUP } from './queries';
import {
  RespondToContentComplaintGroupVariables,
  RespondToContentComplaintGroup,
} from './__generated__/RespondToContentComplaintGroup';
import { ReportedItem as ReportedItemFragment } from './__generated__/ReportedItem';
import ResponseSuccessIcon from './responseSuccessIcon.svg';
import styles from './styles';

const ReportedItem = ({
  reportedItem,
}: {
  reportedItem: ReportedItemFragment;
}) => {
  const { t } = useTranslation('communityReported');
  const dispatch = useDispatch();

  const [responseType, setResponseType] = useState<
    ContentComplaintResponseEnum
  >();

  const [respondToContentComplaintGroup] = useMutation<
    RespondToContentComplaintGroup,
    RespondToContentComplaintGroupVariables
  >(RESPOND_TO_CONTENT_COMPLAINT_GROUP, {
    // Refresh notifications list after responding to content compalint
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });

  if (
    reportedItem.subject.__typename !== 'Post' &&
    reportedItem.subject.__typename !== 'FeedItemComment'
  ) {
    throw new Error(
      'Subject type of ReportedItem passed to ReportedNotificationCenterItem must be either a Post or FeedItemComment',
    );
  }

  const reportedItemType = reportedItem.subject.__typename;
  const subjectId = reportedItem.subject.id;

  const handleIgnore = async () => {
    await respondToContentComplaintGroup({
      variables: {
        input: {
          subjectId,
          subjectType: ContentComplaintSubjectTypeEnum[reportedItemType],
          response: ContentComplaintResponseEnum.ignore,
        },
      },
    });

    setResponseType(ContentComplaintResponseEnum.ignore);
  };

  const handleDelete = () => {
    Alert.alert(
      t(`delete${reportedItemType}.title`),
      t(`delete${reportedItemType}.message`),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t(`delete${reportedItemType}.buttonText`),
          onPress: async () => {
            await respondToContentComplaintGroup({
              variables: {
                input: {
                  subjectId,
                  subjectType:
                    ContentComplaintSubjectTypeEnum[reportedItemType],
                  response: ContentComplaintResponseEnum.delete,
                },
              },
            });

            setResponseType(ContentComplaintResponseEnum.delete);
          },
        },
      ],
    );
  };

  const reportedBy = reportedItem.people.nodes[0].fullName;
  const communityName = reportedItem.subject.feedItem.community?.name || '';
  const communityId = reportedItem.subject.feedItem.community?.id;
  const feedItemId = reportedItem.subject.feedItem.id;

  const handleOpenPost = () => {
    dispatch(
      navigatePush(FEED_ITEM_DETAIL_SCREEN, {
        communityId,
        feedItemId,
      }),
    );
  };

  const {
    card,
    reportedInfoContainer,
    respondedContentContainer,
    respondedTitle,
    respondedMessage,
    comment,
    openPost,
    buttonLeft,
    buttonRight,
  } = styles;

  const renderResponsedContent = () => (
    <View style={respondedContentContainer}>
      <ResponseSuccessIcon />
      <Text style={respondedTitle}>{t('hurray')}</Text>
      <Text style={respondedMessage}>
        {reportedItemType === 'Post'
          ? responseType === ContentComplaintResponseEnum.delete
            ? t('respondedPostMessage.delete')
            : t('respondedPostMessage.ignore')
          : responseType === ContentComplaintResponseEnum.delete
          ? t('respondedFeedItemCommentMessage.delete')
          : t('respondedFeedItemCommentMessage.ignore')}
      </Text>
    </View>
  );

  if (responseType) {
    return renderResponsedContent();
  }

  return (
    <Card style={card}>
      <View style={reportedInfoContainer}>
        <ReportItemLabel
          label={t('reportedBy')}
          user={reportedBy}
          communityName={communityName}
        />
        <Text onPress={handleOpenPost} style={openPost} testID="openPostButton">
          {t('openPost')}
        </Text>
      </View>

      {reportedItem.subject.__typename === 'FeedItemComment' ? (
        <View style={comment}>
          <CommentItem comment={reportedItem.subject} isReported={true} />
        </View>
      ) : null}
      {reportedItem.subject.__typename === 'Post' ? (
        <CommunityFeedItemContent
          postLabelPressable={false}
          feedItem={reportedItem.subject.feedItem}
          showLikeAndComment={false}
        />
      ) : null}

      <Flex direction="row" style={{ paddingTop: 20 }}>
        <Flex value={1}>
          <Button
            testID="ignoreButton"
            type="secondary"
            onPress={handleIgnore}
            text={t('ignore').toUpperCase()}
            style={buttonLeft}
          />
        </Flex>
        <Flex value={1}>
          <Button
            testID="deleteButton"
            type="secondary"
            onPress={handleDelete}
            text={t('delete').toUpperCase()}
            style={buttonRight}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default ReportedItem;
