import React from 'react';

import { renderShallow } from '../../../../testUtils/index';
import StepDetailScreen from '../index';

let bottomButtonProps;
let markdown;
let screen;

beforeEach(() => {
  jest.clearAllMocks();

  screen = renderShallow(
    <StepDetailScreen
      text="Roge is well behaved"
      CenterHeader={{ prop: 'center header' }}
      RightHeader={{ prop: 'right header' }}
      markdown={markdown}
      bottomButtonProps={bottomButtonProps}
    />,
  );
});

describe('markdown is not null', () => {
  beforeAll(() => {
    markdown = 'ROBERT ROBERT ROBERT';
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('markdown is null', () => {
  beforeAll(() => {
    markdown = null;
  });

  describe('bottomButtonProps are not null', () => {
    beforeAll(() => {
      bottomButtonProps = { text: 'bottom button props', onPress: () => {} };
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });
  });

  describe('bottomButtonProps are null', () => {
    beforeAll(() => {
      bottomButtonProps = null;
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });
  });
});
