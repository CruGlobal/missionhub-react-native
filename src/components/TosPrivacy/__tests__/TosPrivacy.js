import React from 'react';
import { Linking } from 'react-native';

import TosPrivacy from '..';

import { testSnapshot, renderShallow } from '../../../../testUtils';
import { LINKS } from '../../../constants';

it('renders tos and privacy', () => {
  testSnapshot(<TosPrivacy />);
});

it('renders trial tos and privacy', () => {
  testSnapshot(<TosPrivacy trial={true} />);
});

describe('test links', () => {
  let component;
  beforeEach(() => {
    Linking.openURL = jest.fn();
    component = renderShallow(<TosPrivacy />);
  });

  it('calls terms link', () => {
    component
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();
    expect(Linking.openURL).toHaveBeenCalledWith(LINKS.terms);
  });
  it('calls privacy link', () => {
    component
      .childAt(1)
      .childAt(2)
      .props()
      .onPress();
    expect(Linking.openURL).toHaveBeenCalledWith(LINKS.privacy);
  });
});
