import React from 'react';
import { ActivityIndicator } from 'react-native';

import Flex from '../Flex';

export default () => (
  <Flex align="center" justify="center" style={{ padding: 10 }}>
    <ActivityIndicator size="small" color="rgba(0, 0, 0, 1)" />
  </Flex>
);
