import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';

import { Text, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import PopupMenu from '../../components/PopupMenu';
import CelebrateItemName from '../../containers/CelebrateItemName';
import { DateConstants } from '../../components/DateComponent';
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
  const { content, person, created_at } = item;
  const {
    itemStyle,
    myStyle,
    text,
    myText,
    content: contentStyle,
    editingStyle,
    name: nameStyle,
  } = styles;
  const name = `${person.first_name} ${person.last_name}`;
  const isMine = person.id === me.id;
  const isMineNotReported = isMine && !isReported;

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
          <CelebrateItemName
            name={name}
            person={person}
            organization={organization}
            pressable={!isReported}
            customContent={<Text style={nameStyle}>{name}</Text>}
          />
        )}
        <CardTime date={created_at} format={DateConstants.comment} />
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
