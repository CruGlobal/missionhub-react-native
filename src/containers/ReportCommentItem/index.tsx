import React from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import gql from 'graphql-tag';

import { Flex, Card, Button } from '../../components/common';
import CommentItem from '../CommentItem';
import ReportCommentLabel from '../../components/ReportCommentLabel';
import { GetReportedContent_community_contentComplaints_nodes as ReportedItem } from '../Groups/__generated__/GetReportedContent';

import {
  RespondToContentComplaintVariables,
  RespondToContentComplaint,
} from './__generated__/respondToContentComplaint';
import styles from './styles';

export const RESPOND_TO_CONTENT_COMPLAINT = gql`
  mutation RespondToContentComplaint($input: RespondToContentComplaintInput!) {
    respondToContentComplaint(input: $input) {
      contentComplaint {
        id
      }
    }
  }
`;

const ReportCommentItem = ({
  item,
  refetch,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: ReportedItem | any;
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
          contentComplaintId: item.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response: 'ignore' as any,
        },
      },
    });

    refetch();
  };

  const getContentType = (type: string) => {
    switch (type) {
      case 'Story':
        return 'storyBy';
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
                contentComplaintId: item.id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                response: 'delete' as any,
              },
            },
          });
          refetch();
        },
      },
    ]);
  };
  const { subject, person } = item;

  const reportedBy = person.fullName;
  const commentBy =
    subject.typeName === 'Story'
      ? subject.author.fullName
      : subject.person.fullName;
  const { card, users, comment, buttonLeft, buttonRight } = styles;
  return (
    <Card style={card}>
      <Flex direction="row" style={users}>
        <ReportCommentLabel label={t('reportedBy')} user={reportedBy} />
        <ReportCommentLabel
          label={t(`${getContentType(subject.typeName)}`)}
          user={commentBy}
        />
      </Flex>
      <Flex style={comment}>
        <CommentItem item={subject} isReported={true} />
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

export default ReportCommentItem;
