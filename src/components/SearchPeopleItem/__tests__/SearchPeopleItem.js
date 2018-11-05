import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SearchPeopleItem from '..';

import { testSnapshot, testSnapshotShallow } from '../../../../testUtils';

const mockPerson = {
  id: '123',
  first_name: 'Test',
  organizational_permissions: [{ organization: { name: 'Test Org' } }],
};
const onSelect = jest.fn();

it('renders single person correctly', () => {
  testSnapshot(<SearchPeopleItem person={mockPerson} onSelect={onSelect} />);
});

it('renders last name correctly', () => {
  testSnapshot(
    <SearchPeopleItem
      person={{ ...mockPerson, last_name: 'Test Last' }}
      onSelect={onSelect}
    />,
  );
});

it('renders no org correctly', () => {
  testSnapshot(
    <SearchPeopleItem
      person={{ ...mockPerson, organizational_permissions: [] }}
      onSelect={onSelect}
    />,
  );
});

it('renders unassign correctly', () => {
  const component = testSnapshotShallow(
    <SearchPeopleItem
      person={{ ...mockPerson, last_name: 'Test Last' }}
      onSelect={onSelect}
    />,
  );

  testItemClick(component);
});

function testItemClick() {
  expect(onSelect).toHaveBeenCalledTimes(0);
}

describe('test handleSelect', () => {
  let component;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <SearchPeopleItem
        person={{ ...mockPerson, last_name: 'Test Last' }}
        onSelect={onSelect}
      />,
    );

    component = screen.instance();
  });

  it('runs onSelect', () => {
    component.handleSelect();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
