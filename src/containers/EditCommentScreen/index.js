import React, { Component } from 'react';
import { View, StatusBar, SafeAreaView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Button, Input, Touchable } from '../../components/common';
import { updateCelebrateComment } from '../../actions/celebrateComments';
import { BackButton } from '../BackButton';
import Header from '../Header';
import theme from '../../theme';
import { navigateBack } from '../../actions/navigation';

import styles from './styles';

@translate('editComment')
class EditCommentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.item.content,
    };
  }

  close = () => this.props.dispatch(navigateBack());

  onTextChanged = text => {
    this.setState({ text });
  };

  saveNote = async () => {
    Keyboard.dismiss();
    const { dispatch, item } = this.props;
    const { text } = this.state;

    await dispatch(updateCelebrateComment(item, text));
    this.close();
  };

  focus = () => this.input.focus();
  inputRef = c => (this.input = c);

  render() {
    const { t } = this.props;
    const { text } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar {...theme.statusBar.lightContent} />
        <Header
          left={<BackButton customNavigate={this.close} />}
          title={t('edit')}
        />
        <SafeAreaView style={styles.content}>
          <Touchable
            activeOpacity={1}
            isAndroidOpacity={true}
            onPress={this.focus}
            style={styles.content}
          >
            <Input
              ref={this.inputRef}
              onChangeText={this.onTextChanged}
              value={text}
              style={styles.text}
              multiline={true}
              blurOnSubmit={false}
              autoGrow={false}
              autoCorrect={true}
            />
          </Touchable>
          <Flex align="stretch" justify="end">
            <Button
              type="secondary"
              onPress={this.saveNote}
              text={t('saveChanges')}
            />
          </Flex>
        </SafeAreaView>
      </View>
    );
  }
}

EditCommentScreen.propTypes = {
  item: PropTypes.object.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(EditCommentScreen);
export const EDIT_COMMENT_SCREEN = 'nav/EDIT_COMMENT_SCREEN';
