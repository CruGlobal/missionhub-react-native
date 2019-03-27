import React from 'react';

import { testSnapshotShallow } from '../../../../testUtils';

import ReportCommentLabel from '..';

it('render label', () => {
  testSnapshotShallow(<ReportCommentLabel label="Label" user="Test User" />);
});
