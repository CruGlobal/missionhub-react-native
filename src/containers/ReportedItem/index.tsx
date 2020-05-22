import React from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { Flex, Card, Button } from '../../components/common';
import CommentItem from '../CommentItem';
import ReportItemLabel from '../../components/ReportItemLabel';
import { ContentComplaintResponseEnum } from '../../../__generated__/globalTypes';
import { Organization } from '../../reducers/organizations';
import { CommunityFeedItemContent } from '../../components/CommunityFeedItemContent';

import { RESPOND_TO_CONTENT_COMPLAINT } from './queries';
import {
  RespondToContentComplaintVariables,
  RespondToContentComplaint,
} from './__generated__/RespondToContentComplaint';
import { ReportedItem as ReportedItemFragment } from './__generated__/ReportedItem';
import styles from './styles';

const ReportedItem = ({
  reportedItem,
  refetch,
}: {
  reportedItem: ReportedItemFragment;
  organization: Organization;
  refetch: () => void;
}) => {
  const { t } = useTranslation('reportComment');

  const [respondToContentComplaint] = useMutation<
    RespondToContentComplaint,
    RespondToContentComplaintVariables
  >(RESPOND_TO_CONTENT_COMPLAINT);
  const handleIgnore = async () => {
    await respondToContentComplaint({
      variables: {
        input: {
          contentComplaintId: reportedItem.id,

          response: ContentComplaintResponseEnum.ignore,
        },
      },
    });
    refetch();
  };

  const getContentType = (type: string) => {
    switch (type) {
      case 'Story':
        return 'storyBy';
      case 'FeedItemComment':
      case 'CommunityCelebrationItemComment':
        return 'commentBy';
      default:
        return 'commentBy';
    }
  };

  const handleDelete = () => {
    Alert.alert(t('deleteTitle'), '', [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('ok'),
        onPress: async () => {
          await respondToContentComplaint({
            variables: {
              input: {
                contentComplaintId: reportedItem.id,

                response: ContentComplaintResponseEnum.delete,
              },
            },
          });
          refetch();
        },
      },
    ]);
  };

  const reportedBy = reportedItem.person.fullName;
  const commentBy =
    (reportedItem.subject.__typename === 'Post' &&
      reportedItem.subject.feedItem.subjectPersonName) ||
    (reportedItem.subject.__typename === 'FeedItemComment' &&
      reportedItem.subject.person.fullName) ||
    '';
  const { card, users, comment, buttonLeft, buttonRight } = styles;
  return (
    <Card style={card}>
      <Flex direction="row" style={users}>
        <ReportItemLabel label={t('reportedBy')} user={reportedBy} />
        <ReportItemLabel
          label={t(`${getContentType(reportedItem.subject.__typename)}`)}
          user={commentBy}
        />
      </Flex>
      <Flex style={comment}>
        {reportedItem.subject.__typename === 'FeedItemComment' ? (
          <CommentItem comment={reportedItem.subject} isReported={true} />
        ) : null}
        {reportedItem.subject.__typename === 'Post' ? (
          <CommunityFeedItemContent feedItem={reportedItem.subject.feedItem} />
        ) : null}
      </Flex>
      <Flex direction="row">
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
