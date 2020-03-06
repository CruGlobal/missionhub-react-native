/* eslint max-lines-per-function: 0 */
import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, View, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

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

interface CommentBoxProps {
  editingComment: boolean;
  onCancel: () => void;
  onSubmit: (action: any, text: string) => void;
  placeholderTextKey: string;
  hideActions: boolean;
  containerStyle: StyleSheet;
}

const CommentBox = ({
  editingComment,
  onCancel,
  onSubmit,
  placeholderTextKey,
  hideActions,
  containerStyle,
}: CommentBoxProps) => {
  const { t } = useTranslation('actions');
  const commentInput = useRef();
  const [text, setText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [action, setAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEdit = (comment: any) => {
    setText(comment.content);
    commentInput.current.focus();
  };

  useEffect(() => {
    editingComment && startEdit(editingComment);
  }, [editingComment]);

  const cancel = () => {
    setText('');
    setShowActions(false);
    setAction(null);
    setIsSubmitting(false);

    onCancel();
    Keyboard.dismiss();
  };

  const submit = async () => {
    Keyboard.dismiss();
    const origText = text;
    const origShowActions = showActions;
    const origActions = action;

    try {
      setText('');
      setShowActions(false);
      setAction(null);
      setIsSubmitting(true);

      await onSubmit(action, text);

      setIsSubmitting(false);
    } catch (error) {
      setText(origText);
      setShowActions(origShowActions);
      setAction(origActions);
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (t: string) => {
    setText(t);
  };

  const handleActionPress = () => {
    setShowActions(!showActions);
  };

  const selectAction = item => {
    setAction(item);
  };

  const clearAction = () => {
    setAction(null);
  };

  const renderIcons = item => {
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
        onPress={selectAction}
        style={actionRowWrap}
      >
        <Flex
          style={[
            actionIconButton,
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

  const renderActions = () => {
    const { actions } = styles;

    if (!showActions) {
      return null;
    }

    return (
      <Flex direction="row" align="center" style={actions}>
        {ACTION_ITEMS.map(renderIcons)}
      </Flex>
    );
  };

  const renderInput = () => {
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
                onPress={clearAction}
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
            ref={commentInput}
            onChangeText={handleTextChange}
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
              onPress={submit}
              style={submitIcon}
              size={22}
            />
          ) : null}
        </Flex>
      </Flex>
    );
  };

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
                onPress={handleActionPress}
                style={actionSelection}
              />
            </Flex>
          ) : null}
          {!action && editingComment ? (
            <Flex style={cancelWrap}>
              <IconButton
                name="deleteIcon"
                type="MissionHub"
                onPress={cancel}
                style={cancelIcon}
                size={12}
              />
            </Flex>
          ) : null}
          {renderInput()}
        </Flex>
        {renderActions()}
      </SafeAreaView>
    </View>
  );
};

export default CommentBox;
