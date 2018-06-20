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
const COMMENT_ACTION = Object.values(INTERACTION_TYPES).find(
  i => i.isOnAction && i.translationKey === 'interactionNote',
);

const initialState = {
  text: '',
  isFocused: false,
  showActions: false,
  action: null,
};

@translate('actions')
class CommentBox extends Component {
  state = initialState;

  submit = () => {
    const { action, text } = this.state;
    let interaction = action;

    if (!interaction) {
      interaction = COMMENT_ACTION;
    }

    let data = { interaction, text };
    this.props.onSubmit(data);

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

    return (
      <Touchable
        key={item.id}
        onPress={() => this.selectAction(item)}
        style={styles.actionRowWrap}
      >
        <Flex
          style={[
            styles.actionIconButton,
            action && item.id === action.id ? styles.actionIconActive : null,
          ]}
        >
          <Icon
            size={16}
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
        direction="column"
        align="center"
        justify="center"
        style={styles.inputBoxWrap}
        self="stretch"
      >
        {action ? (
          <Flex
            direction="row"
            align="center"
            self="stretch"
            style={styles.activeAction}
          >
            <Flex value={1} align="center">
              <Icon
                name={action.iconName}
                type="MissionHub"
                size={24}
                style={styles.activeIcon}
              />
            </Flex>
            <Flex value={4} justify="center" style={styles.activeTextWrap}>
              <DateComponent
                date={new Date()}
                format="LL"
                style={styles.activeDate}
              />
              <Text style={styles.activeText}>{t(action.translationKey)}</Text>
            </Flex>
            <Flex style={styles.clearAction}>
              <Button
                type="transparent"
                onPress={this.clearAction}
                style={styles.clearActionButton}
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
          style={styles.inputWrap}
        >
          <Input
            ref={c => (this.searchInput = c)}
            onFocus={this.focus}
            onBlur={this.blur}
            onChangeText={this.handleTextChange}
            value={text}
            style={styles.input}
            autoFocus={false}
            autoCorrect={true}
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
      </Flex>
    );
  }

  render() {
    const { hideActions } = this.props;
    const { showActions, action } = this.state;
    return (
      <Flex direction="column" style={styles.container}>
        <Flex
          direction="row"
          align="center"
          justify="center"
          style={styles.boxWrap}
        >
          {!hideActions && !action ? (
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
                size={13}
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
  hideActions: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default CommentBox;
