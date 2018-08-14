import React from 'react';

import CelebrateItem from '../../src/components/CelebrateItem';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

const myId = '123';
const otherId = '456';

let event;

describe('CelebrateItem', () => {
  const testEvent = e => {
    testSnapshotShallow(
      <CelebrateItem event={e} myId={myId} onToggleLike={jest.fn()} />,
    );
  };

  it('renders event for subject=me, liked=true, like count>0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: myId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 1,
      liked: true,
    };
    testEvent(event);
  });

  it('renders event for subject=me, liked=false, like count>0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: myId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 1,
      liked: false,
    };
    testEvent(event);
  });

  it('renders event for subject=me, liked=false, like count=0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: myId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: false,
    };
    testEvent(event);
  });

  it('renders event for subject=other, liked=true, like count>0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: otherId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 1,
      liked: true,
    };
    testEvent(event);
  });

  it('renders event for subject=other, liked=false, like count=0', () => {
    event = {
      subject_person_name: 'John Smith',
      subject_person: {
        id: otherId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: false,
    };
    testEvent(event);
  });
});

describe('onPressLikeIcon', () => {
  it('calls onToggleLike prop', () => {
    event = {
      id: '1',
      subject_person_name: 'John Smith',
      subject_person: {
        id: otherId,
      },
      changed_attribute_value: '2004-04-04 00:00:00 UTC',
      likes_count: 0,
      liked: false,
    };

    const instance = renderShallow(
      <CelebrateItem event={event} myId={myId} onToggleLike={jest.fn()} />,
    ).instance();

    instance.onPressLikeIcon();
    expect(instance.props.onToggleLike).toHaveBeenCalledWith(
      event.id,
      event.liked,
    );
  });
});
