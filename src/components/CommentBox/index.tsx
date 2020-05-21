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

import {
  Text,
  IconButton,
  Input,
  Icon,
  Button,
  DateComponent,
} from '../common';
import theme from '../../theme';
import { FeedItemEditingComment } from '../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedCommentBox/__generated__/FeedItemEditingComment';

import styles from './styles';

export type ActionItem = {
  id: string;
  iconName: string;
  translationKey: string;
  hideReport?: boolean;
  isOnAction?: boolean;
  tracking: string;
};

interface CommentBoxProps {
  onCancel?: () => void;
  onSubmit: (action: ActionItem | null, text: string) => void;
  placeholderTextKey: string;
  showInteractions?: boolean;
  editingComment?: FeedItemEditingComment;
  containerStyle?: ViewStyle;
  testID?: string;
}

const CommentBox = ({
  onCancel,
  onSubmit,
  placeholderTextKey,
  editingComment,
  containerStyle,
}: CommentBoxProps) => {
  const { t } = useTranslation('actions');
  const commentInput = useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [action, setAction] = useState<ActionItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
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
    cancelWrap,
    cancelIcon,
  } = styles;

  const startEdit = (comment: FeedItemEditingComment) => {
    setText(comment.content);
    commentInput.current && commentInput.current.focus();
  };

  useEffect(() => {
    editingComment && startEdit(editingComment);
  }, [editingComment]);

  const resetState = () => {
    setText('');
    setAction(null);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetState();
    onCancel && onCancel();
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const origText = text;
    const origActions = action;

    try {
      resetState();
      setIsSubmitting(true);

      await onSubmit(action, text);

      setIsSubmitting(false);
    } catch (error) {
      setText(origText);
      setAction(origActions);
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (t: string) => {
    setText(t);
  };

  const handleClearAction = () => {
    setAction(null);
  };

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
            testID="ClearActionButton"
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
      editingComment ? (
        <View style={cancelWrap}>
          <IconButton
            testID="CancelButton"
            name="deleteIcon"
            type="MissionHub"
            onPress={handleCancel}
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
            testID="SubmitButton"
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

  return (
    <SafeAreaView style={[container, containerStyle]}>
      <View style={boxWrap}>
        {renderTopButton()}
        {renderInput()}
      </View>
    </SafeAreaView>
  );
};

export default CommentBox;
