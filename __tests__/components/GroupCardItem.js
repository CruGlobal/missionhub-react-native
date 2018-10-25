import React from 'react';

import GroupCardItem from '../../src/components/GroupCardItem';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

const contactsCount = 768;
const unassignedCount = 13;
// const uncontactedCount = 56;

let group = {
  name: 'Group Name',
  contactReport: {},
};

const test = () => {
  testSnapshotShallow(<GroupCardItem group={group} />);
};

describe('GroupCardItem', () => {
  it('renders with no report counts', () => {
    test();
  });

  it('renders with all report counts', () => {
    group = {
      ...group,
      contactReport: {
        contactsCount,
        unassignedCount,
      },
    };

    test();
  });

  it('renders with unassigned, no contacts', () => {
    group = {
      ...group,
      contactReport: {
        unassignedCount,
      },
    };

    test();
  });

  it('renders with contacts, no unassigned', () => {
    group = {
      ...group,
      contactReport: {
        contactsCount,
      },
    };

    test();
  });

  it('renders user created group', () => {
    group = {
      ...group,
      user_created: true,
    };

    test();
  });

  it('renders with image url', () => {
    group = {
      ...group,
      imageUrl:
        'https://vignette.wikia.nocookie.net/edain-mod/images/6/6e/Mordor_Submod_Banner.jpg',
    };

    test();
  });

  it('calls props.onPress when pressed', () => {
    const onPress = jest.fn();
    const component = renderShallow(
      <GroupCardItem group={group} onPress={onPress} />,
    );

    component.simulate('press');

    expect(onPress).toHaveBeenCalled();
  });
});
