import { celebrationSelector } from '../../src/selectors/celebration';

const celebrateItems = [
  {
    id: '1',
    celebrateable_type: 'interaction',
    adjective_attribute_value: 2,
    changed_attribute_value: '2018-01-01 00:00:00 UTC',
  },
  {
    id: '2',
    celebrateable_type: 'interaction',
    adjective_attribute_value: 4,
    changed_attribute_value: '2017-01-01 00:00:00 UTC',
  },
  {
    id: '3',
    celebrateable_type: 'interaction',
    adjective_attribute_value: 11,
    changed_attribute_value: '2018-01-02 00:07:00 UTC',
  },
  {
    id: '4',
    celebrateable_type: 'accepted_challenge',
    adjective_attribute_value: 2,
    changed_attribute_value: '2018-01-07 00:00:00 UTC',
  },
  {
    id: '5',
    celebrateable_type: 'interaction',
    adjective_attribute_value: 9,
    changed_attribute_value: '2018-01-05 00:00:00 UTC',
  },
  {
    id: '6',
    celebrateable_type: 'interaction',
    adjective_attribute_value: 5,
    changed_attribute_value: '2018-01-02 00:23:00 UTC',
  },
  {
    id: '7',
    celebrateable_type: 'interaction',
    adjective_attribute_value: 3,
    changed_attribute_value: '2018-01-02 00:00:00 UTC',
  },
];

const invalidItems = [
  {
    id: '11',
    celebrateable_type: 'interaction',
    adjective_attribute_value: 42,
    changed_attribute_value: '2018-01-01 00:00:00 UTC',
  },
  {
    id: '12',
    celebrateable_type: 'interaction',
    adjective_attribute_value: 1,
    changed_attribute_value: '2017-01-01 00:00:00 UTC',
  },
  {
    id: '13',
    celebrateable_type: 'roge',
    adjective_attribute_value: 11,
    changed_attribute_value: '2018-01-02 00:07:00 UTC',
  },
];

it('sorts items into sections by date', () => {
  expect(celebrationSelector({ celebrateItems })).toMatchSnapshot();
});

it('filters out celebrate items it cannot render', () => {
  const combinedItems = celebrateItems.concat(invalidItems);
  const selectedCelebrationItems = celebrationSelector({ combinedItems });
  expect(selectedCelebrationItems).toMatchSnapshot();
});
