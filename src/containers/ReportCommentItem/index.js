import React from 'react';
import { Alert } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Flex, Card, Button } from '../../components/common';
import CommentItem from '../CommentItem';
import ReportCommentLabel from '../../components/ReportCommentLabel';
import { deleteCelebrateComment } from '../../actions/celebrateComments';
import { ignoreReportComment } from '../../actions/reportComments';

import styles from './styles';

const ReportCommentItem = ({ item, organization: { id: orgId }, refetch }) => {
  const { t } = useTranslation('reportComment');
  const dispatch = useDispatch();

  const handleIgnore = async () => {
    await dispatch(ignoreReportComment(orgId, item.id));
    refetch();
  };
  const getContentCreator = content => {
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

  const getContentType = content => {
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
          await dispatch(
            deleteCelebrateComment(
              orgId,
              item.comment.organization_celebration_item,
              item.comment,
            ),
          );
          refetch();
        },
      },
    ]);
  };
  const { subject, person } = item;

  const reportedBy = person.fullName;
  const commentBy = getContentCreator(subject);
  const {
    card,
    users,
    comment,
    buttons,
    button,
    buttonLeft,
    buttonRight,
  } = styles;
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
      <Flex direction="row" style={buttons}>
        <Flex value={1}>
          <Button
            type="secondary"
            onPress={handleIgnore}
            text={t('ignore').toUpperCase()}
            style={[button, buttonLeft]}
          />
        </Flex>
        <Flex value={1}>
          <Button
            type="secondary"
            onPress={handleDelete}
            text={t('delete').toUpperCase()}
            style={[button, buttonRight]}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default ReportCommentItem;
