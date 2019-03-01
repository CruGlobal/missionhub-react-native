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

describe('test markdown styles', () => {
  beforeAll(() => {
    markdown =
      '# HEADING 1\r\n## HEADING 2\r\n### HEADING 3\r\nSample text: **bold** and *italic*\r\n\r\n- Bullet 1\r\n- Bullet 2\r\n- Bullet 3\r\n1. Bullet 1\r\n2. Bullet 2\r\n3. Bullet 3\r\n\r\n---\r\n\r\n![Image](https://s3.amazonaws.com/stage.missionhub.com/organizations/community_photos/original/15853/1549383219755.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJKEW3SYT6MSDBAPA%2F20190227%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190227T160524Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=b1349c8dbc71bfa2af6bfcc953db10edeac258208ddb0b4fdf5905d0f7a25267)\r\n\r\n---\r\n\r\n[Get MissionHub!](get.missionhub.com)\r\n\r\n> *Some Quote* \n> *~ Some Guy*\r\n';
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
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
