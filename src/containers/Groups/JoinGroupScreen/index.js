import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Keyboard,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  Flex,
  Text,
  Input,
  IconButton,
  Button,
} from '../../../components/common';
import Header from '../../Header';
import theme from '../../../theme';
import GROUP_ICON from '../../../../assets/images/MemberContacts_light.png';
import { navigateBack } from '../../../actions/navigation';
import ImagePicker from '../../../components/ImagePicker';

import styles from './styles';

@translate('groupsJoinGroup')
class JoinGroupScreen extends Component {
  state = {
    code: '',
    imageUri: null,
  };

  onChangeCode = code => this.setState({ code });

  onSearch = () => {
    Keyboard.dismiss();
    const text = (this.state.name || '').trim();
    if (!text) {
      return;
    }

    // TODO: search community by code
  };

  joinCommunity = () => {
    Keyboard.dismiss();
    // TODO: join community
  };

  handleImageChange = data => this.setState({ imageUri: data.uri });

  navigateBack = () => this.props.dispatch(navigateBack());

  ref = c => (this.nameInput = c);

  renderImage() {
    const { imageUri } = this.state;
    if (imageUri) {
      return (
        <Image
          resizeMode="cover"
          source={{ uri: imageUri }}
          style={styles.image}
        />
      );
    }
    return <Image source={CAMERA_ICON} />;
  }

  renderStart() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Image resizeMode="contain" source={GROUP_ICON} style={styles.image} />
        <Text style={styles.text}>{t('enterCode')}</Text>
      </Flex>
    );
  }

  renderError() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Text style={styles.text}>{t('communityNotFound')}</Text>
      </Flex>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          shadow={false}
          title={t('joinCommunity')}
        />
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
          <Flex align="center" justify="end" style={styles.imageWrap}>
            {this.renderStart()}
          </Flex>
          <Flex style={styles.fieldWrap}>
            <Input
              style={styles.input}
              onChangeText={this.onChangeCode}
              maxLength={6}
            />
          </Flex>
          <KeyboardAvoidingView
            keyboardVerticalOffset={theme.buttonHeight}
            style={styles.flex}
          />
        </ScrollView>

        <Flex align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.onSearch}
            text={t('search').toUpperCase()}
            style={styles.searchButton}
          />
        </Flex>
      </View>
    );
  }
}

JoinGroupScreen.propTypes = {};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(JoinGroupScreen);
export const JOIN_GROUP_SCREEN = 'nav/JOIN_GROUP_SCREEN';
