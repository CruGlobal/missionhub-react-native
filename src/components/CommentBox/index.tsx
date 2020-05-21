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

import { IconButton, Input } from '../common';
import theme from '../../theme';
import { FeedItemEditingComment } from '../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedCommentBox/__generated__/FeedItemEditingComment';

import styles from './styles';

interface CommentBoxProps {
  onCancel?: () => void;
  onSubmit: (text: string) => void;
  placeholderText: string;
  showInteractions?: boolean;
  editingComment?: FeedItemEditingComment;
  containerStyle?: ViewStyle;
  testID?: string;
}

const CommentBox = ({
  onCancel,
  onSubmit,
  placeholderText,
  editingComment,
  containerStyle,
}: CommentBoxProps) => {
  const commentInput = useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    inputBoxWrap,
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

    try {
      resetState();
      setIsSubmitting(true);

      await onSubmit(text);

      setIsSubmitting(false);
    } catch (error) {
      setText(origText);
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (t: string) => {
    setText(t);
  };

  const renderTopButton = () =>
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
    ) : null;

  const renderInput = () => (
    <View style={inputBoxWrap}>
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
          placeholder={placeholderText}
          placeholderTextColor={theme.grey1}
        />
        {text ? (
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
