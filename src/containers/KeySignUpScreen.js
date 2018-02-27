import React, { Component } from 'react';
import { WebView, Linking } from 'react-native';

export default class KeySignUpScreen extends Component {

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
    });

    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => {
    console.log(JSON.stringify(event));
  };

  render() {
    const uri = 'https://thekey.me/cas/login?action=signup';

    return (
      <WebView
        source={{ uri }}
        style={{ marginTop: 20 }}
      />
    );
  }
}

export const KEY_SIGN_UP_SCREEN = 'nav/KEY_SIGN_UP';
