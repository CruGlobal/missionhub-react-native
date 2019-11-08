import React from 'react';
import { Share, Linking } from 'react-native';

import { renderWithContext } from '../../../../testUtils';

import ShareSurveyMenu from '..';

const props = {
  survey: { id: '1', title: 'test' },
};

describe('ShareSurveyMenu', () => {
  it('renders share survey menu', () => {
    renderWithContext(<ShareSurveyMenu {...props} />).snapshot();
  });
  it('renders share survey menu in header', () => {
    renderWithContext(<ShareSurveyMenu {...props} header={true} />).snapshot();
  });

  it('calls take survey', () => {
    Linking.openURL = jest.fn();
    const { getByTestId } = renderWithContext(<ShareSurveyMenu {...props} />);
    getByTestId('ShareSurveyMenu').props.actions[1].onPress();
    expect(Linking.openURL).toHaveBeenCalled();
  });

  it('calls share survey', () => {
    Share.share = jest.fn();
    const { getByTestId } = renderWithContext(<ShareSurveyMenu {...props} />);
    getByTestId('ShareSurveyMenu').props.actions[0].onPress();
    expect(Share.share).toHaveBeenCalled();
  });
});
