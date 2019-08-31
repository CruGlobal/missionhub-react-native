import React from 'react';
import { Linking } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { LINKS } from '../../../constants';

import TosPrivacy from '..';

it('renders tos and privacy', () => {
  renderWithContext(<TosPrivacy />, { noWrappers: true });
});

it('renders trial tos and privacy', () => {
  renderWithContext(<TosPrivacy trial={true} />, { noWrappers: true });
});

describe('test links', () => {
  beforeEach(() => {
    Linking.openURL = jest.fn();
  });

  it('calls terms link', () => {
    const { getByTestId } = renderWithContext(<TosPrivacy />, {
      noWrappers: true,
    });
    fireEvent.press(getByTestId('ToSButton'));
    expect(Linking.openURL).toHaveBeenCalledWith(LINKS.terms);
  });
  it('calls privacy link', () => {
    const { getByTestId } = renderWithContext(<TosPrivacy />, {
      noWrappers: true,
    });
    fireEvent.press(getByTestId('PrivacyButton'));
    expect(Linking.openURL).toHaveBeenCalledWith(LINKS.privacy);
  });
});
