import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { testSnapshot, testSnapshotShallow } from '../../../../testUtils';

import SearchPeopleItem from '..';

const mockPerson = {
  id: '123',
  first_name: 'Test',
  organizational_permissions: [{ organization: { name: 'Test Org' } }],
};
const onSelect = jest.fn();

it('renders single person correctly', () => {
  // @ts-ignore
  testSnapshot(<SearchPeopleItem person={mockPerson} onSelect={onSelect} />);
});

it('renders last name correctly', () => {
  testSnapshot(
    <SearchPeopleItem
      // @ts-ignore
      person={{ ...mockPerson, last_name: 'Test Last' }}
      onSelect={onSelect}
    />,
  );
});

it('renders no org correctly', () => {
  testSnapshot(
    <SearchPeopleItem
      // @ts-ignore
      person={{ ...mockPerson, organizational_permissions: [] }}
      onSelect={onSelect}
    />,
  );
});

it('renders unassign correctly', () => {
  const component = testSnapshotShallow(
    <SearchPeopleItem
      // @ts-ignore
      person={{ ...mockPerson, last_name: 'Test Last' }}
      onSelect={onSelect}
    />,
  );

  // @ts-ignore
  testItemClick(component);
});

function testItemClick() {
  expect(onSelect).toHaveBeenCalledTimes(0);
}

describe('test handleSelect', () => {
  // @ts-ignore
  let component;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <SearchPeopleItem
        // @ts-ignore
        person={{ ...mockPerson, last_name: 'Test Last' }}
        onSelect={onSelect}
      />,
    );

    component = screen.instance();
  });

  it('runs onSelect', () => {
    // @ts-ignore
    component.handleSelect();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
