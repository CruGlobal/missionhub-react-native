import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { Text, Touchable, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import CelebrateItemName from '../../containers/CelebrateItemName';

import styles from './styles';

class CommentItem extends Component {
  ref = c => (this.view = c);

  handleLongPress = () => {
    const { item, onLongPress } = this.props;
    onLongPress(item, this.view);
  };

  render() {
    const {
      item: { content, created_at, person },
      organization,
      me,
    } = this.props;
    const {
      content: contentStyle,
      itemStyle,
      myStyle,
      text,
      myText,
      name: nameStyle,
    } = styles;

    const name = `${person.first_name} ${person.last_name}`;
    const isMine = person.id === me.id;

    return (
      <View style={contentStyle}>
        <Flex direction="row" align="center">
          {isMine ? (
            <Flex value={1} />
          ) : (
            <CelebrateItemName
              name={name}
              person={person}
              organization={organization}
              pressable={true}
              customContent={<Text style={nameStyle}>{name}</Text>}
            />
          )}
          <CardTime date={created_at} />
        </Flex>
        <Flex direction="row">
          {isMine ? <Flex value={1} /> : null}
          <Touchable onLongPress={this.handleLongPress}>
            <View ref={this.ref} style={[itemStyle, isMine ? myStyle : null]}>
              <Text style={[text, isMine ? myText : null]}>{content}</Text>
            </View>
          </Touchable>
          {!isMine ? <Flex value={1} /> : null}
        </Flex>
      </View>
    );
  }
}

CommentItem.propTypes = {
  item: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  onLongPress: PropTypes.func.isRequired,
  isMine: PropTypes.bool,
};
const mapStateToProps = ({ auth }) => ({
  me: auth.person,
});

export default connect(mapStateToProps)(CommentItem);
