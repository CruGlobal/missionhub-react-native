import React from 'react';
import { View } from 'react-native';

import { Text, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import PopupMenu from '../../components/PopupMenu';
import { CommunityFeedItemName } from '../../components/CommunityFeedItemName';
import { useIsMe } from '../../utils/hooks/useIsMe';

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
  isEditing: boolean;
}

const CommentItem = ({
  comment,
  menuActions,
  isReported,
  isEditing,
}: CommentItemProps) => {
  const { content, person, createdAt } = comment;
  const {
    itemStyle,
    myStyle,
    text,
    myText,
    content: contentStyle,
    editingStyle,
    name: nameStyle,
  } = styles;
  const isMine = useIsMe(person.id);
  const isMineNotReported = isMine && !isReported;
  const name = person.fullName;

  const renderContent = () => {
    return (
      <View style={[itemStyle, isMineNotReported ? myStyle : null]}>
        <Text style={[text, isMineNotReported ? myText : null]}>{content}</Text>
      </View>
    );
  };

  return (
    <View style={[contentStyle, isEditing ? editingStyle : null]}>
      <Flex direction="row" align="end">
        {isMineNotReported ? (
          <Flex value={1} />
        ) : (
          <CommunityFeedItemName
            name={name}
            personId={person.id}
            pressable={!isReported}
            customContent={<Text style={nameStyle}>{name}</Text>}
          />
        )}
        <CardTime date={createdAt} />
      </Flex>
      <Flex direction="row">
        {isMineNotReported ? <Flex value={1} /> : null}
        {menuActions ? (
          <PopupMenu
            actions={menuActions}
            triggerOnLongPress={true}
            disabled={isReported}
          >
            {renderContent()}
          </PopupMenu>
        ) : (
          renderContent()
        )}
        {!isMineNotReported ? <Flex value={1} /> : null}
      </Flex>
    </View>
  );
};

export default CommentItem;
