import React, { useState } from 'react';
import { Modal, View, TextStyle } from 'react-native';

import Flex from '../Flex';
import IconButton from '../IconButton';
import { Text, Button } from '../common';

import styles from './styles';

const {
  modalStyle,
  containerStyle,
  modalButton,
  closeButton,
  titleText,
  bodyText,
} = styles;

export const InfoModal = ({
  title,
  titleStyle,
  body,
  buttonLabel,
  action = () => {},
}: {
  title?: string;
  titleStyle?: TextStyle;
  body?: string;
  buttonLabel: string;
  action?: () => void;
}) => {
  const [visible, setVisible] = useState(true);

  return visible ? (
    <Modal transparent animationType={'slide'} visible={true}>
      <View style={modalStyle}>
        <View style={containerStyle}>
          <Flex
            direction="row"
            justify="end"
            style={{ width: '100%', marginTop: -60 }}
          >
            <IconButton
              testID="CloseButton"
              style={closeButton}
              onPress={() => setVisible(false)}
              name="close"
              type="Material"
              size={32}
            />
          </Flex>
          {title ? <Text style={[titleText, titleStyle]}>{title}</Text> : null}
          {body ? <Text style={bodyText}>{body}</Text> : null}

          <Button
            testID={'AnnouncementNoActionButton'}
            pill={true}
            style={modalButton}
            text={buttonLabel}
            onPress={() => {
              action();
              setVisible(false);
            }}
          />
        </View>
      </View>
    </Modal>
  ) : null;
};
