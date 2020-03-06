/* eslint max-lines-per-function: 0 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  View,
  SafeAreaView,
  TextInput,
  ViewStyle,
} from 'react-native';
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
import { CelebrateComment } from '../../reducers/celebrateComments';

import styles from './styles';

export type ActionItem = {
  id: string;
  iconName: string;
  translationKey: string;
  hideReport?: boolean;
  isOnAction?: boolean;
  tracking: string;
};

const ACTION_ITEMS = (Object.values(INTERACTION_TYPES) as ActionItem[]).filter(
  i => i.isOnAction && i.translationKey !== 'interactionNote',
);

interface CommentBoxProps {
  onCancel?: () => void;
  onSubmit: (action: ActionItem | null, text: string) => void;
  placeholderTextKey: string;
  showInteractions?: boolean;
  editingComment?: CelebrateComment;
  containerStyle?: ViewStyle;
  testID?: string;
}

const CommentBox = ({
  onCancel,
  onSubmit,
  placeholderTextKey,
  showInteractions,
  editingComment,
  containerStyle,
}: CommentBoxProps) => {
  const { t } = useTranslation('actions');
  const commentInput = useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [action, setAction] = useState<ActionItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    actionRowWrap,
    actionIconButton,
    actionIconActive,
    actionText,
    inputBoxWrap,
    activeAction,
    activeActionIcon,
    activeIcon,
    activeTextWrap,
    activeDate,
    activeText,
    clearAction,
    clearActionButton,
    inputWrap,
    input,
    submitIcon,
    container,
    boxWrap,
    actionSelectionWrap,
    actionsOpen,
    cancelWrap,
    cancelIcon,
    actions,
  } = styles;

  const startEdit = (comment: CelebrateComment) => {
    setText(comment.content);
    commentInput.current && commentInput.current.focus();
  };

  useEffect(() => {
    editingComment && startEdit(editingComment);
  }, [editingComment]);

  const cancel = () => {
    setText('');
    setShowActions(false);
    setAction(null);
    setIsSubmitting(false);

    onCancel && onCancel();
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
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

  const selectAction = (item: ActionItem) => {
    setAction(item);
  };

  const handleClearAction = () => {
    setAction(null);
  };

  const renderActionIcons = (item: ActionItem) => (
    <Touchable
      key={item.id}
      pressProps={[item]}
      onPress={selectAction}
      style={actionRowWrap}
    >
      <View
        style={[
          actionIconButton,
          action && item.id === `${action.id}` ? actionIconActive : null,
        ]}
      >
        <Icon size={16} name={item.iconName} type="MissionHub" />
      </View>
      <Text style={actionText} numberOfLines={2}>
        {t(item.translationKey)}
      </Text>
    </Touchable>
  );

  const renderActionDisplay = () =>
    action ? (
      <View style={activeAction}>
        <View style={activeActionIcon}>
          <Icon
            name={action.iconName}
            type="MissionHub"
            size={24}
            style={activeIcon}
          />
        </View>
        <View style={activeTextWrap}>
          <DateComponent date={new Date()} format="LL" style={activeDate} />
          <Text style={activeText}>{t(action.translationKey)}</Text>
        </View>
        <View style={clearAction}>
          <Button
            type="transparent"
            onPress={handleClearAction}
            style={clearActionButton}
          >
            <Icon name="deleteIcon" type="MissionHub" size={10} />
          </Button>
        </View>
      </View>
    ) : null;

  const renderTopButton = () =>
    !action ? (
      showInteractions ? (
        <View style={[actionSelectionWrap, showActions ? actionsOpen : null]}>
          <IconButton
            name={showActions ? 'deleteIcon' : 'plusIcon'}
            type="MissionHub"
            size={13}
            onPress={handleActionPress}
          />
        </View>
      ) : editingComment ? (
        <View style={cancelWrap}>
          <IconButton
            name="deleteIcon"
            type="MissionHub"
            onPress={cancel}
            style={cancelIcon}
            size={12}
          />
        </View>
      ) : null
    ) : null;

  const renderInput = () => (
    <View style={inputBoxWrap}>
      {renderActionDisplay()}
      <View style={inputWrap}>
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
            onPress={handleSubmit}
            style={submitIcon}
            size={22}
          />
        ) : null}
      </View>
    </View>
  );

  const renderActions = () =>
    !showActions ? null : (
      <Flex direction="row" align="center" style={actions}>
        {ACTION_ITEMS.map(renderActionIcons)}
      </Flex>
    );

  return (
    <SafeAreaView style={[container, containerStyle]}>
      <View style={boxWrap}>
        {renderTopButton()}
        {renderInput()}
      </View>
      {renderActions()}
    </SafeAreaView>
  );
};

export default CommentBox;
