import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';

import { Text, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import PopupMenu from '../../components/PopupMenu';
import { CommunityFeedItemName } from '../../components/CommunityFeedItemName';
import { AuthState } from '../../reducers/auth';
import {
  CelebrateCommentsState,
  CelebrateComment,
} from '../../reducers/celebrateComments';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';

import styles from './styles';

export interface CommentItemProps {
  testID?: string;
  item: CelebrateComment;
  menuActions?: {
    text: string;
    onPress: () => void;
    destructive?: boolean;
  }[];
  organization: Organization;
  isReported?: boolean;
  me: Person;
  isEditing: boolean;
}

const CommentItem = ({
  item,
  menuActions,
  organization,
  isReported,
  me,
  isEditing,
}: CommentItemProps) => {
  const { content, person, author, created_at, createdAt } = item;
  const {
    itemStyle,
    myStyle,
    text,
    myText,
    content: contentStyle,
    editingStyle,
    name: nameStyle,
  } = styles;
  const isMine = person ? person.id === me.id : author.id === me.id;
  const isMineNotReported = isMine && !isReported;
  const itemDate = created_at ? created_at : createdAt ? createdAt : '';
  const name = person
    ? person.first_name
      ? `${person.first_name} ${person.last_name}`
      : person.fullName
    : author.fullName;

  const renderContent = () => {
    return (
      <View style={[itemStyle, isMineNotReported ? myStyle : null]}>
        <Text style={[text, isMineNotReported ? myText : null]}>{content}</Text>
      </View>
    );
  };

  return (
    // Android needs the collapsable property to use '.measure' properly within the <CelebrateDetailScreen>
    // https://github.com/facebook/react-native/issues/3282#issuecomment-201934117
    <View
      collapsable={false}
      style={[contentStyle, isEditing ? editingStyle : null]}
    >
      <Flex direction="row" align="end">
        {isMineNotReported ? (
          <Flex value={1} />
        ) : (
          <CommunityFeedItemName
            name={name}
            person={person}
            communityId={organization.id}
            pressable={!isReported}
            customContent={<Text style={nameStyle}>{name}</Text>}
          />
        )}
        <CardTime date={itemDate} />
      </Flex>
      <Flex direction="row">
        {isMineNotReported ? <Flex value={1} /> : null}
        {menuActions ? (
          <PopupMenu
            // @ts-ignore
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

const mapStateToProps = (
  {
    auth,
    celebrateComments: { editingCommentId },
  }: { auth: AuthState; celebrateComments: CelebrateCommentsState },
  { item }: { item: CelebrateComment },
) => ({
  me: auth.person,
  isEditing: editingCommentId === item.id,
});

export default connect(mapStateToProps)(CommentItem);
