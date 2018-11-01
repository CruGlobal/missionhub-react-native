import React from 'react';
import { Share, Linking } from 'react-native';

import ShareSurveyMenu from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

const props = {
  survey: { id: '1', title: 'test' },
};

describe('ShareSurveyMenu', () => {
  it('renders share survey menu', () => {
    testSnapshotShallow(<ShareSurveyMenu {...props} />);
  });
  it('renders share survey menu in header', () => {
    testSnapshotShallow(<ShareSurveyMenu {...props} header={true} />);
  });

  it('calls take survey', () => {
    Linking.openURL = jest.fn();
    const instance = renderShallow(<ShareSurveyMenu {...props} />).instance();
    instance.takeSurvey();
    expect(Linking.openURL).toHaveBeenCalled();
  });

  it('calls share survey', () => {
    Share.share = jest.fn();
    const instance = renderShallow(<ShareSurveyMenu {...props} />).instance();
    instance.shareSurvey();
    expect(Share.share).toHaveBeenCalled();
  });
});
