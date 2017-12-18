import React, { Component } from 'react';
import { View, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';

import { Text, Flex, Button } from '../../components/common';
import styles from './styles';

class ContactNotes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: 'Hello, world! Hello, world! Hello, world! Hello, world! Hello, world! Hello, world! Hello, world! Hello, world! Hello, world! Hello, world! Hello, world! Hello, world! ',
    };
  }

  textChanged(text) {
    this.setState({text: text});
  }

  saveNotes() {}

  renderNotes() {
    return (
      <TextInput
        onChangeText={(t) => this.textChanged(t)}
        value={this.state.text}
        style={styles.notesText}
        multiline={true}
      />
    );
  }

  renderEmpty() {
    const text = 'Remember important details about '
      + this.props.person.personFirstName
      + ', like favorite food, hobbies they love or something interesting they said.';

    return (
      <Flex align="center" justify="center">
        <Image source={require('../../../assets/images/notesIcon.png')} />
        <Text type="header" style={styles.nullHeader}>MY NOTES</Text>
        <Text style={styles.nullText}>{text}</Text>
      </Flex>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Flex align="stretch" justify="center" value={1} style={styles.container}>
          { this.state.text ? this.renderNotes() : this.renderEmpty() }
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.saveNotes}
            text="EDIT PRIVATE NOTES"
          />
        </Flex>
      </View>
    );
  }
}

export default connect()(ContactNotes);
