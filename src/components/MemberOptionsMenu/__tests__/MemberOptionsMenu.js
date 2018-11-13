import React from 'react';

import MemberOptionsMenu from '..';

import { testSnapshotShallow } from '../../../../testUtils';

const myId = '1';
const otherId = '2';

let props;

const test = () => {
  testSnapshotShallow(<MemberOptionsMenu {...props} />);
};

describe('MemberOptionsMenu', () => {
  it('renders for me', () => {
    props = {
      myId,
      personId: myId,
      iAmAdmin: false,
      iAmOwner: false,
      personIsAdmin: false,
    };
    test();
  });

  it('renders for admin looking at member', () => {
    props = {
      myId,
      personId: otherId,
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: false,
    };
    test();
  });

  it('renders for admin looking at admin', () => {
    props = {
      myId,
      personId: otherId,
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: true,
    };
    test();
  });

  it('renders for owner looking at member', () => {
    props = {
      myId,
      personId: otherId,
      iAmAdmin: true,
      iAmOwner: true,
      personIsAdmin: false,
    };
    test();
  });

  it('renders for owner looking at admin', () => {
    props = {
      myId,
      personId: otherId,
      iAmAdmin: true,
      iAmOwner: true,
      personIsAdmin: true,
    };
    test();
  });
});
