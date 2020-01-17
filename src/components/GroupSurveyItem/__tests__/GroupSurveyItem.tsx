import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';

import GroupSurveyItem from '..';

const survey = {
  id: '1',
  created_at: '2018-05-29T17:02:02Z',
  title: 'Winter Conference 2018',
  contacts_count: 50,
  uncontacted_contacts_count: 30,
  unassigned_contacts_count: 25,
};

it('render survey', () => {
  // @ts-ignore
  testSnapshotShallow(<GroupSurveyItem onSelect={jest.fn()} survey={survey} />);
});

it('render 0 contacts', () => {
  testSnapshotShallow(
    <GroupSurveyItem
      // @ts-ignore
      onSelect={jest.fn()}
      survey={{ ...survey, contacts_count: 0 }}
    />,
  );
});

it('render 0 uncontacted', () => {
  testSnapshotShallow(
    <GroupSurveyItem
      // @ts-ignore
      onSelect={jest.fn()}
      survey={{ ...survey, uncontacted_contacts_count: 0 }}
    />,
  );
});

it('render 0 unassigned', () => {
  testSnapshotShallow(
    <GroupSurveyItem
      // @ts-ignore
      onSelect={jest.fn()}
      survey={{ ...survey, unassigned_contacts_count: 0 }}
    />,
  );
});

it('render 0 unassigned and 0 uncontacted', () => {
  testSnapshotShallow(
    <GroupSurveyItem
      // @ts-ignore
      onSelect={jest.fn()}
      survey={{
        ...survey,
        unassigned_contacts_count: 0,
        uncontacted_contacts_count: 0,
      }}
    />,
  );
});

it('calls onSelect prop', () => {
  const onSelect = jest.fn();

  // @ts-ignore
  renderShallow(<GroupSurveyItem onSelect={onSelect} survey={survey} />)
    .instance()
    // @ts-ignore
    .handleSelect();

  expect(onSelect).toHaveBeenCalled();
});
