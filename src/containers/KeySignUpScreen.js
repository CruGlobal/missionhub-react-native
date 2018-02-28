import React, { Component } from 'react';
import { WebView, Linking } from 'react-native';
import { THE_KEY_CLIENT_ID } from '../constants';
import { sha256 } from 'js-sha256';
import base64url from 'base64-url';
import randomString from 'random-string';
global.Buffer = global.Buffer || require('buffer').Buffer;

export default class KeySignUpScreen extends Component {
  constructor(props) {
    super(props);

    const string = randomString({ length: 50, numeric: true, letters: true, special: false });
    this.codeVerifier = base64url.encode(string);
    this.codeChallege = base64url.encode(sha256.array(this.codeVerifier));
  }

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
    const uri = `https://thekey.me/cas/login?action=signup&client_id=${THE_KEY_CLIENT_ID}&response_type=code`
      + '&redirect_uri=https://missionhub.com/auth&scope=fullticket%20extended&code_challenge_method=S256'
      + `&code_challenge=${this.codeChallege}`;

    return (
      <WebView
        source={{ uri }}
        style={{ marginTop: 20 }}
      />
    );
  }
}

export const KEY_SIGN_UP_SCREEN = 'nav/KEY_SIGN_UP';
