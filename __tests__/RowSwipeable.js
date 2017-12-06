import 'react-native';
import React from 'react';
import { View } from 'react-native';

// Note: test renderer must be required after react-native.
import RowSwipeable from '../src/components/RowSwipeable';
import { testSnapshot } from '../testUtils';

it('renders correctly', () => {
  testSnapshot(
    <RowSwipeable>
      <View />
    </RowSwipeable>
  );
});
