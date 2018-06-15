import { celebrationSelector } from '../../src/selectors/celebration';

const celebrateItems = [
  {
    id: '1',
    changed_attribute_value: '2018-01-01 00:00:00 UTC',
  },
  {
    id: '2',
    changed_attribute_value: '2017-01-01 00:00:00 UTC',
  },
  {
    id: '3',
    changed_attribute_value: '2018-01-02 00:07:00 UTC',
  },
  {
    id: '4',
    changed_attribute_value: '2018-01-07 00:00:00 UTC',
  },
  {
    id: '5',
    changed_attribute_value: '2018-01-05 00:00:00 UTC',
  },
  {
    id: '6',
    changed_attribute_value: '2018-01-02 00:23:00 UTC',
  },
  {
    id: '7',
    changed_attribute_value: '2018-01-02 00:00:00 UTC',
  },
];

it('sorts items into sections by date', () => {
  expect(celebrationSelector({ celebrateItems })).toMatchSnapshot();
});
