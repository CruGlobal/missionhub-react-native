import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { Text, Touchable, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import CelebrateItemName from '../../containers/CelebrateItemName';
import { DateConstants } from '../../components/DateComponent';

import styles from './styles';

class CommentItem extends Component {
  ref = c => (this.view = c);
  setMenuRef = c => (this.menuRef = c);

  handleLongPress = () => {
    const { item, onLongPress } = this.props;
    onLongPress(item, this.menuRef);
  };

  render() {
    const {
      item: { content, created_at, person },
      organization,
      me,
      isEditing,
      isReported,
    } = this.props;
    const {
      content: contentStyle,
      editingStyle,
      itemStyle,
      myStyle,
      text,
      myText,
      name: nameStyle,
    } = styles;

    const name = `${person.first_name} ${person.last_name}`;
    const isMine = person.id === me.id;
    const isMineNotReported = isMine && !isReported;

    return (
      // Android needs the collapsable property to use '.measure' properly within the <CelebrateDetailScreen>
      // https://github.com/facebook/react-native/issues/3282#issuecomment-201934117
      <View
        ref={this.ref}
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
          <Touchable disabled={isReported} onLongPress={this.handleLongPress}>
            <View
              ref={this.setMenuRef}
              style={[itemStyle, isMineNotReported ? myStyle : null]}
            >
              <Text style={[text, isMineNotReported ? myText : null]}>
                {content}
              </Text>
            </View>
          </Touchable>
          {!isMineNotReported ? <Flex value={1} /> : null}
        </Flex>
      </View>
    );
  }
}

CommentItem.propTypes = {
  item: PropTypes.object.isRequired,
  organization: PropTypes.object,
  onLongPress: PropTypes.func,
  isReported: PropTypes.bool,
};
const mapStateToProps = (
  { auth, celebrateComments: { editingCommentId } },
  { item },
) => ({
  me: auth.person,
  isEditing: editingCommentId === item.id,
});

export default connect(
  mapStateToProps,
  undefined,
  undefined,
  { forwardRef: true },
)(CommentItem);
