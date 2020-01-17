import React from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Flex, Card, Button } from '../../components/common';
import CommentItem from '../CommentItem';
import ReportCommentLabel from '../../components/ReportCommentLabel';
import { ignoreReportComment } from '../../actions/reportComments';
import { GetReportedContent_community_contentComplaints_nodes as ReportedItem } from '../Groups/__generated__/GetReportedContent';

import styles from './styles';

const ReportCommentItem = ({
  item,
  orgId,
  refetch,
}: {
  item: ReportedItem;
  orgId: string;
  refetch: () => void;
}) => {
  const { t } = useTranslation('reportComment');
  const dispatch = useDispatch();

  const handleIgnore = async () => {
    await dispatch(ignoreReportComment(orgId, item.id));
    refetch();
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getContentCreator = (content: any) => {
    const { typeName, person, author } = content;

    switch (typeName) {
      case 'Story':
        return author.fullName;
      case 'CommunityCelebrationItemComment':
        return person.fullName;
      default:
        return person.fullName;
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getContentType = (content: any) => {
    const { typeName } = content;

    switch (typeName) {
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
          // Deleteing contnet will go here once mutation is avaiable
          await refetch();
        },
      },
    ]);
  };
  const { subject, person } = item;

  const reportedBy = person.fullName;
  const commentBy = getContentCreator(subject);
  const { card, users, comment, buttonLeft, buttonRight } = styles;
  return (
    <Card style={card}>
      <Flex direction="row" style={users}>
        <ReportCommentLabel label={t('reportedBy')} user={reportedBy} />
        <ReportCommentLabel
          label={t(`${getContentType(subject)}`)}
          user={commentBy}
        />
      </Flex>
      <Flex style={comment}>
        <CommentItem item={subject} isReported={true} />
      </Flex>
      <Flex direction="row">
        <Flex value={1}>
          <Button
            type="secondary"
            onPress={handleIgnore}
            text={t('ignore').toUpperCase()}
            style={buttonLeft}
          />
        </Flex>
        <Flex value={1}>
          <Button
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
