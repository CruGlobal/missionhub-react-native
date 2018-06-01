import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../testUtils';
import GroupSurveyItem from '../../src/components/GroupSurveyItem';

const survey = {
  id: '1',
  created_at: '2018-05-29T17:02:02Z',
  survey: { title: 'Winter Conference 2018' },
  contactNum: 50,
  uncontactedNum: 30,
  unassignedNum: 25,
};

it('render survey', () => {
  testSnapshotShallow(<GroupSurveyItem onSelect={jest.fn()} survey={survey} />);
});

it('render 0 contacts', () => {
  testSnapshotShallow(
    <GroupSurveyItem
      onSelect={jest.fn()}
      survey={{ ...survey, contactNum: 0 }}
    />,
  );
});

it('render 0 uncontacted', () => {
  testSnapshotShallow(
    <GroupSurveyItem
      onSelect={jest.fn()}
      survey={{ ...survey, uncontactedNum: 0 }}
    />,
  );
});

it('render 0 unassigned', () => {
  testSnapshotShallow(
    <GroupSurveyItem
      onSelect={jest.fn()}
      survey={{ ...survey, unassignedNum: 0 }}
    />,
  );
});

it('render 0 unassigned and 0 uncontacted', () => {
  testSnapshotShallow(
    <GroupSurveyItem
      onSelect={jest.fn()}
      survey={{ ...survey, unassignedNum: 0, uncontactedNum: 0 }}
    />,
  );
});

it('calls onSelect prop', () => {
  const onSelect = jest.fn();

  renderShallow(<GroupSurveyItem onSelect={onSelect} survey={survey} />)
    .instance()
    .handleSelect();

  expect(onSelect).toHaveBeenCalled();
});
