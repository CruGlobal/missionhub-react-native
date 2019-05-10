import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '../common';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: { backgroundColor: theme.red, alignItems: 'center', padding: 5 },
  message: { color: theme.white },
});

export const ErrorNotice = ({ message }: { message: string }) => (
  <View style={styles.container}>
    <Text style={styles.message}>{message}</Text>
  </View>
);
