import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { DateComponent } from '../src/components/common';
import {testSnapshot} from '../testUtils';

it('renders correctly', () => {
  testSnapshot(
    <DateComponent date="2017-11-20" />
  );
});
