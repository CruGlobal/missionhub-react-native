import React from 'react';

import CelebrateItem from '../../src/components/CelebrateItem';
import { testSnapshotShallow } from '../../testUtils';

it('renders correctly', () => {
  testSnapshotShallow(
    <CelebrateItem
      event={{
        subject_person_name: 'John Smith',
        changed_attribute_value: '2004-04-04 00:00:00 UTC',
        likes_count: 4,
      }}
    />,
  );
});
