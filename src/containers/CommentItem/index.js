import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { Text, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import PopupMenu from '../../components/PopupMenu';
import CelebrateItemName from '../../containers/CelebrateItemName';
import { DateConstants } from '../../components/DateComponent';

import styles from './styles';

class CommentItem extends Component {
  renderContent = () => {
    const {
      item: { content, person },
      me,
      isReported,
    } = this.props;
    const { itemStyle, myStyle, text, myText } = styles;

    const isMine = person.id === me.id;
    const isMineNotReported = isMine && !isReported;

    return (
      <View style={[itemStyle, isMineNotReported ? myStyle : null]}>
        <Text style={[text, isMineNotReported ? myText : null]}>{content}</Text>
      </View>
    );
  };

  render() {
    const {
      item: { created_at, person },
      organization,
      me,
      isEditing,
      isReported,
      menuActions,
    } = this.props;
    const { content: contentStyle, editingStyle, name: nameStyle } = styles;

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
          {menuActions ? (
            <PopupMenu
              actions={menuActions}
              triggerOnLongPress={true}
              disabled={isReported}
            >
              {this.renderContent()}
            </PopupMenu>
          ) : (
            this.renderContent()
          )}
          {!isMineNotReported ? <Flex value={1} /> : null}
        </Flex>
      </View>
    );
  }
}

CommentItem.propTypes = {
  item: PropTypes.object.isRequired,
  organization: PropTypes.object,
  isReported: PropTypes.bool,
  menuActions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
    }),
  ),
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
  { withRef: true },
)(CommentItem);
