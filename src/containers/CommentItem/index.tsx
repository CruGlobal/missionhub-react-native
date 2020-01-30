import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';

import { Text, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import PopupMenu from '../../components/PopupMenu';
import CelebrateItemName from '../../containers/CelebrateItemName';
import { DateConstants } from '../../components/DateComponent';

import styles from './styles';

class CommentItem extends Component {
  renderContent = () => {
    const {
      // @ts-ignore
      item: { content, person, author },
      // @ts-ignore
      me,
      // @ts-ignore
      isReported,
    } = this.props;
    const { itemStyle, myStyle, text, myText } = styles;

    const isMine = person ? person.id === me.id : author.id === me.id;
    const isMineNotReported = isMine && !isReported;

    return (
      <View style={[itemStyle, isMineNotReported ? myStyle : null]}>
        <Text style={[text, isMineNotReported ? myText : null]}>{content}</Text>
      </View>
    );
  };

  personName = () => {
    const {
      // @ts-ignore
      item: { person, author },
    } = this.props;
    const name = person
      ? person.first_name
        ? `${person.first_name} ${person.last_name}`
        : person.fullName
      : author.fullName;
    return name;
  };

  render() {
    const {
      // @ts-ignore
      item: { created_at, person, author, createdAt },
      // @ts-ignore
      organization,
      // @ts-ignore
      me,
      // @ts-ignore
      isEditing,
      // @ts-ignore
      isReported,
      // @ts-ignore
      menuActions,
    } = this.props;
    const { content: contentStyle, editingStyle, name: nameStyle } = styles;

    const isMine = person ? person.id === me.id : author.id === me.id;
    const isMineNotReported = isMine && !isReported;
    const itemDate = created_at ? created_at : createdAt;

    return (
      // Android needs the collapsable property to use '.measure' properly within the <CelebrateDetailScreen>
      // https://github.com/facebook/react-native/issues/3282#issuecomment-201934117
      <View
        // @ts-ignore
        ref={this.ref}
        collapsable={false}
        style={[contentStyle, isEditing ? editingStyle : null]}
      >
        <Flex direction="row" align="end">
          {isMineNotReported ? (
            <Flex value={1} />
          ) : (
            <CelebrateItemName
              // @ts-ignore
              name={this.personName()}
              person={person}
              organization={organization}
              pressable={!isReported}
              customContent={<Text style={nameStyle}>{this.personName()}</Text>}
            />
          )}
          <CardTime date={itemDate} format={DateConstants.comment} />
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

// @ts-ignore
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
  // @ts-ignore
  { auth, celebrateComments: { editingCommentId } },
  // @ts-ignore
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
