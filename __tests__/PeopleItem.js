import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import PeopleItem from '../src/components/PeopleItem';
import { testSnapshot } from '../testUtils';

const mockPerson = {
  id: '123',
  first_name: 'John',
  last_name: 'Doe',
  full_name: 'John Doe',
  gender: 'Female',
  student_status: null,
  campus: null,
  year_in_school: null,
  major: null,
  minor: null,
  birth_date: null,
  date_became_christian: null,
  graduation_date: null,
  picture: 'https://graph.facebook.com/v2.5/0/picture',
  fb_uid: 0,
  created_at: '2017-12-05T15:13:10Z',
  updated_at: '2017-12-05T15:13:10Z',
};

it('renders correctly', () => {
  testSnapshot(
    <PeopleItem person={mockPerson} onSelect={() => {}} />
  );
});

it('renders me correctly', () => {
  testSnapshot(
    <PeopleItem person={mockPerson} onSelect={() => {}} isMe={true} />
  );
});
