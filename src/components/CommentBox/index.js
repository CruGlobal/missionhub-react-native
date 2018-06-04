import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { INTERACTION_TYPES } from '../../constants';
import { Flex, Text, IconButton, Input, Touchable, Icon } from '../common';
import theme from '../../theme';

import styles from './styles';

const ACTION_ITEMS = Object.values(INTERACTION_TYPES).filter(
  i => i.isOnAction && i.iconName !== 'commentIcon',
);

@translate('actions')
class CommentBox extends Component {
  state = {
    text: '',
    isFocused: false,
    showActions: false,
    action: null,
  };

  submit = () => {
    const data = {};
    this.props.onSubmit(data);
  };

  handleTextChange = t => {
    this.setState({ text: t });
  };

  handleActionPress = () => {
    this.setState({ showActions: !this.state.showActions });
  };

  focus = () => {
    this.setState({ isFocused: true, showActions: false });
  };

  blur = () => {
    this.setState({ isFocused: false });
  };

  selectAction = item => {
    LOG('item', item);
  };

  renderIcons = item => {
    const { t } = this.props;

    return (
      <Touchable
        key={item.id}
        onPress={() => this.selectAction(item)}
        style={styles.actionRowWrap}
      >
        <Flex style={styles.actionIconButton}>
          <Icon
            size={22}
            style={styles.actionIcon}
            name={item.iconName}
            type="MissionHub"
          />
        </Flex>
        <Text style={styles.actionText}>{t(item.translationKey)}</Text>
      </Touchable>
    );
  };

  renderActions() {
    if (!this.state.showActions) return null;
    return (
      <Flex direction="row" align="center" style={styles.actions}>
        {ACTION_ITEMS.map(this.renderIcons)}
      </Flex>
    );
  }

  renderInput() {
    const { t, placeholder } = this.props;
    const { text, action } = this.state;
    return (
      <Flex
        value={1}
        direction="row"
        align="center"
        justify="center"
        style={styles.inputWrap}
        self="stretch"
      >
        <Input
          ref={c => (this.searchInput = c)}
          onFocus={this.focus}
          onBlur={this.blur}
          onChangeText={this.handleTextChange}
          value={text}
          style={styles.input}
          autoFocus={false}
          returnKeyType="done"
          blurOnSubmit={true}
          placeholder={placeholder || t('placeholder')}
          placeholderTextColor={theme.grey1}
        />
        {text || action ? (
          <IconButton
            name="cancelIcon"
            type="MissionHub"
            onPress={this.submit}
            style={styles.submitIcon}
          />
        ) : null}
      </Flex>
    );
  }

  render() {
    const { isFocused, showActions, action } = this.state;
    return (
      <Flex direction="column" style={styles.container}>
        <Flex
          direction="row"
          align="center"
          justify="center"
          style={styles.boxWrap}
        >
          {!isFocused && !action ? (
            <Flex
              align="center"
              justify="center"
              style={[
                styles.actionSelectionWrap,
                showActions ? styles.actionsOpen : null,
              ]}
            >
              <IconButton
                name={showActions ? 'deleteIcon' : 'plusIcon'}
                type="MissionHub"
                size={16}
                onPress={this.handleActionPress}
                style={[
                  styles.actionSelection,
                  showActions ? styles.actionsOpenIcon : null,
                ]}
              />
            </Flex>
          ) : null}
          {this.renderInput()}
        </Flex>
        {this.renderActions()}
      </Flex>
    );
  }
}

CommentBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default CommentBox;
