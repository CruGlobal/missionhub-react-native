/* eslint max-lines-per-function: 0 */
import React, { Component } from 'react';
import { Keyboard, View, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

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
  // @ts-ignore
  i => i.isOnAction && i.translationKey !== 'interactionNote',
);

const initialState = {
  text: '',
  showActions: false,
  action: null,
  isSubmitting: false,
};

// @ts-ignore
@withTranslation('actions')
export default class CommentBox extends Component {
  state = initialState;

  componentDidMount() {
    // @ts-ignore
    const { editingComment } = this.props;
    if (editingComment) {
      this.startEdit(editingComment);
    }
  }

  // @ts-ignore
  componentDidUpdate(prevProps) {
    // @ts-ignore
    const { editingComment } = this.props;
    if (!prevProps.editingComment && editingComment) {
      this.startEdit(editingComment);
    }
  }

  cancel = () => {
    this.setState(initialState);
    // @ts-ignore
    this.props.onCancel();
    Keyboard.dismiss();
  };

  // @ts-ignore
  startEdit = comment => {
    this.setState({ text: comment.content });
    // @ts-ignore
    this.commentInput.focus();
  };

  submit = async () => {
    // @ts-ignore
    const { onSubmit } = this.props;
    const { action, text } = this.state;

    Keyboard.dismiss();
    const origState = this.state;
    try {
      // Optimistically reset the whole box before the APi before waiting for the API call
      this.setState({ ...initialState, isSubmitting: true });
      await onSubmit(action, text);
      this.setState({ isSubmitting: false });
    } catch (error) {
      this.setState({ ...origState, isSubmitting: false });
    }
  };

  // @ts-ignore
  handleTextChange = t => {
    this.setState({ text: t });
  };

  handleActionPress = () => {
    this.setState({ showActions: !this.state.showActions });
  };

  // @ts-ignore
  selectAction = item => {
    this.setState({ action: item });
  };

  clearAction = () => {
    this.setState({ action: null });
  };

  // @ts-ignore
  renderIcons = item => {
    // @ts-ignore
    const { t } = this.props;
    const { action } = this.state;
    const {
      actionRowWrap,
      actionIconButton,
      actionIconActive,
      // @ts-ignore
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
            // @ts-ignore
            action && item.id === `${action.id}` ? actionIconActive : null,
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

  // @ts-ignore
  ref = c => (this.commentInput = c);

  renderInput() {
    // @ts-ignore
    const { t, placeholderTextKey } = this.props;
    const { text, action, isSubmitting } = this.state;
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
                // @ts-ignore
                name={action.iconName}
                type="MissionHub"
                size={24}
                style={activeIcon}
              />
            </Flex>
            <Flex value={4} justify="center" style={activeTextWrap}>
              <DateComponent date={new Date()} format="LL" style={activeDate} />
              // @ts-ignore
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
              disabled={isSubmitting}
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
    // @ts-ignore
    const { hideActions, editingComment, containerStyle } = this.props;
    const { showActions, action } = this.state;
    const {
      container,
      boxWrap,
      actionSelectionWrap,
      actionsOpen,
      // @ts-ignore
      actionSelection,
      cancelWrap,
      cancelIcon,
    } = styles;

    return (
      <View style={[container, containerStyle]}>
        <SafeAreaView>
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
            {!action && editingComment ? (
              <Flex style={cancelWrap}>
                <IconButton
                  name="deleteIcon"
                  type="MissionHub"
                  onPress={this.cancel}
                  style={cancelIcon}
                  size={12}
                />
              </Flex>
            ) : null}
            {this.renderInput()}
          </Flex>
          {this.renderActions()}
        </SafeAreaView>
      </View>
    );
  }
}

// @ts-ignore
CommentBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  hideActions: PropTypes.bool,
  containerStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  placeholderTextKey: PropTypes.string.isRequired,
  editingComment: PropTypes.object,
};
