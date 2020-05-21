import React from 'react';
import { View } from 'react-native';

import { Text, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import PopupMenu from '../../components/PopupMenu';
import { CommunityFeedItemName } from '../../components/CommunityFeedItemName';
import { useIsMe } from '../../utils/hooks/useIsMe';

import styles from './styles';
import { FeedItemCommentItem } from './__generated__/FeedItemCommentItem';
import Avatar from '../../components/Avatar';

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
  const { content, person, createdAt } = comment;
  const name = person.fullName;

  const renderComment = () => {
    return (
      <View style={[styles.commentBody, isEditing && styles.editingComment]}>
        <Text style={styles.text}>{content}</Text>
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
