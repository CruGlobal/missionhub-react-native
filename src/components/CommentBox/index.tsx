/* eslint max-lines-per-function: 0 */
import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, View, SafeAreaView, TextInput } from 'react-native';

import { IconButton, Input } from '../common';
import theme from '../../theme';
import { FeedItemEditingComment } from '../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedCommentBox/__generated__/FeedItemEditingComment';
import Avatar, { AvatarPerson } from '../Avatar';

import styles from './styles';
import SubmitPostArrowDisabled from './submitPostArrowDisabled.svg';
import SubmitPostArrowActive from './submitPostArrowActive.svg';

interface CommentBoxProps {
  avatarPerson?: AvatarPerson;
  onCancel?: () => void;
  onSubmit: (text: string) => void;
  onFocus?: () => void;
  placeholderText: string;
  editingComment?: FeedItemEditingComment;
  testID?: string;
}

const CommentBox = ({
  avatarPerson,
  onCancel,
  onSubmit,
  onFocus,
  placeholderText,
  editingComment,
}: CommentBoxProps) => {
  const commentInput = useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { inputBox, input, container, cancelWrap, cancelIcon } = styles;

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
    if (!text || isSubmitting) {
      return;
    }

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

  const renderCancelButton = () => (
    <View style={cancelWrap}>
      <IconButton
        testID="CancelButton"
        name="deleteIcon"
        type="MissionHub"
        onPress={handleCancel}
        style={cancelIcon}
        size={16}
      />
    </View>
  );

  return (
    <SafeAreaView style={container}>
      {editingComment ? (
        renderCancelButton()
      ) : (
        <Avatar size="small" person={avatarPerson} />
      )}
      <View style={inputBox}>
        <Input
          ref={commentInput}
          onChangeText={handleTextChange}
          value={text}
          style={input}
          autoFocus={false}
          onFocus={onFocus}
          autoCorrect={true}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          blurOnSubmit={true}
          placeholder={placeholderText}
          placeholderTextColor={theme.grey1}
        />
      </View>
      {!text || isSubmitting ? (
        <SubmitPostArrowDisabled testID="SubmitButton" />
      ) : (
        <SubmitPostArrowActive testID="SubmitButton" onPress={handleSubmit} />
      )}
    </SafeAreaView>
  );
};

export default CommentBox;
