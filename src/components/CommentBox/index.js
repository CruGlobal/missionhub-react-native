/* eslint max-lines-per-function: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { INTERACTION_TYPES } from '../../constants';
import {
  Flex,
  Text,
  IconButton,
  Input,
  Touchable,
  Icon,
  Button,
  DateComponent,
} from '../common';
import theme from '../../theme';

import styles from './styles';

const ACTION_ITEMS = Object.values(INTERACTION_TYPES).filter(
  i => i.isOnAction && i.translationKey !== 'interactionNote',
);

const initialState = {
  text: '',
  isFocused: false,
  showActions: false,
  action: null,
};

@translate('actions')
export default class CommentBox extends Component {
  state = initialState;

  submit = async () => {
    const { onSubmit } = this.props;
    const { action, text } = this.state;

    await onSubmit(action, text);

    this.setState(initialState);
  };

  handleTextChange = t => {
    this.setState({ text: t });
  };

  handleActionPress = () => {
    this.setState({ showActions: !this.state.showActions });
  };

  focus = () => {
    this.setState({ isFocused: true });
  };

  blur = () => {
    this.setState({ isFocused: false });
  };

  selectAction = item => {
    this.setState({ action: item });
  };

  clearAction = () => {
    this.setState({ action: null });
  };

  renderIcons = item => {
    const { t } = this.props;
    const { action } = this.state;
    const {
      actionRowWrap,
      actionIconButton,
      actionIconActive,
      actionIcon,
      actionText,
    } = styles;

    return (
      <Touchable
        key={item.id}
        pressProps={[item]}
        onPress={this.selectAction}
        style={actionRowWrap}
      >
        <Flex
          style={[
            actionIconButton,
            action && item.id === action.id ? actionIconActive : null,
          ]}
        >
          <Icon
            size={16}
            style={actionIcon}
            name={item.iconName}
            type="MissionHub"
          />
        </Flex>
        <Text style={actionText} numberOfLines={2}>
          {t(item.translationKey)}
        </Text>
      </Touchable>
    );
  };

  renderActions() {
    const { showActions } = this.state;
    const { actions } = styles;

    if (!showActions) {
      return null;
    }

    return (
      <Flex direction="row" align="center" style={actions}>
        {ACTION_ITEMS.map(this.renderIcons)}
      </Flex>
    );
  }

  ref = c => (this.searchInput = c);

  renderInput() {
    const { t, placeholderTextKey } = this.props;
    const { text, action } = this.state;
    const {
      inputBoxWrap,
      activeAction,
      activeIcon,
      activeTextWrap,
      activeDate,
      activeText,
      clearAction,
      clearActionButton,
      inputWrap,
      input,
      submitIcon,
    } = styles;

    return (
      <Flex
        value={1}
        direction="column"
        align="center"
        justify="center"
        style={inputBoxWrap}
        self="stretch"
      >
        {action ? (
          <Flex
            direction="row"
            align="center"
            self="stretch"
            style={activeAction}
          >
            <Flex value={1} align="center">
              <Icon
                name={action.iconName}
                type="MissionHub"
                size={24}
                style={activeIcon}
              />
            </Flex>
            <Flex value={4} justify="center" style={activeTextWrap}>
              <DateComponent date={new Date()} format="LL" style={activeDate} />
              <Text style={activeText}>{t(action.translationKey)}</Text>
            </Flex>
            <Flex style={clearAction}>
              <Button
                type="transparent"
                onPress={this.clearAction}
                style={clearActionButton}
              >
                <Icon name="deleteIcon" type="MissionHub" size={10} />
              </Button>
            </Flex>
          </Flex>
        ) : null}
        <Flex
          direction="row"
          align="center"
          justify="center"
          self="stretch"
          style={inputWrap}
        >
          <Input
            ref={this.ref}
            onFocus={this.focus}
            onBlur={this.blur}
            onChangeText={this.handleTextChange}
            value={text}
            style={input}
            autoFocus={false}
            autoCorrect={true}
            returnKeyType="done"
            blurOnSubmit={true}
            placeholder={t(placeholderTextKey)}
            placeholderTextColor={theme.grey1}
          />
          {text || action ? (
            <IconButton
              name="upArrow"
              type="MissionHub"
              onPress={this.submit}
              style={submitIcon}
              size={22}
            />
          ) : null}
        </Flex>
      </Flex>
    );
  }

  render() {
    const { hideActions, containerStyle } = this.props;
    const { showActions, action } = this.state;
    const {
      container,
      boxWrap,
      actionSelectionWrap,
      actionsOpen,
      actionSelection,
    } = styles;

    return (
      <Flex direction="column" style={[container, containerStyle]}>
        <Flex direction="row" align="center" justify="center" style={boxWrap}>
          {!hideActions && !action ? (
            <Flex
              align="center"
              justify="center"
              style={[actionSelectionWrap, showActions ? actionsOpen : null]}
            >
              <IconButton
                name={showActions ? 'deleteIcon' : 'plusIcon'}
                type="MissionHub"
                size={13}
                onPress={this.handleActionPress}
                style={actionSelection}
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
  hideActions: PropTypes.bool,
  containerStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  placeholderTextKey: PropTypes.string.isRequired,
};
