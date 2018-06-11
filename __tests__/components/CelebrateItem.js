import React from 'react';
import CelebrateItem from '../../src/components/CelebrateItem';

import { testSnapshot } from '../../testUtils';

it('renders correctly', () => {
  testSnapshot(
    <CelebrateItem
      event={{
        full_name: 'John Smith',
        changed_attribute_value: '2004-04-04 00:00:00 UTC',
        title: 'John had a Discipleship Conversation',
        likes_count: 4,
      }}
    />,
  );
});
