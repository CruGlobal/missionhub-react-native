import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '../../components/common';
import CardTime from '../../components/CardTime';
import PopupMenu from '../../components/PopupMenu';
import { CommunityFeedItemName } from '../../components/CommunityFeedItemName';
import Avatar from '../../components/Avatar';
import ItemHeaderText from '../../components/ItemHeaderText';

import styles from './styles';
import { FeedItemCommentItem } from './__generated__/FeedItemCommentItem';

export interface CommentItemProps {
  testID?: string;
  comment: FeedItemCommentItem;
  menuActions?: {
    text: string;
    onPress: () => void;
    destructive?: boolean;
  }[];
  isReported?: boolean;
  isEditing?: boolean;
}

const CommentItem = ({
  comment,
  menuActions,
  isReported,
  isEditing,
}: CommentItemProps) => {
  const { t } = useTranslation('commentItem');

  const { content, person, createdAt } = comment;
  const name = person.fullName;

  const renderComment = () => {
    return (
      <View style={[styles.commentBody, isEditing && styles.editingComment]}>
        <Text>{content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Avatar person={comment.person} size="small" />
      <View style={styles.contentContainer}>
        <View style={styles.commentHeader}>
          <CommunityFeedItemName
            name={name}
            personId={person.id}
            pressable={!isReported}
            customContent={<Text style={styles.name}>{name}</Text>}
          />
          <CardTime date={createdAt} />
          {comment.createdAt !== comment.updatedAt ? ( // TODO: replace updatedAt with contentUpdatedAt
            <>
              <Text style={[styles.edited, styles.editedBullet]}> • </Text>
              <Text style={styles.edited}>{t('edited')}</Text>
            </>
          ) : null}
        </View>
        {menuActions ? (
          <PopupMenu
            actions={menuActions}
            triggerOnLongPress={true}
            disabled={isReported}
          >
            {renderComment()}
          </PopupMenu>
        ) : (
          renderComment()
        )}
      </View>
    </View>
  );
};

export default CommentItem;
