import { LayoutAnimation } from 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { renderShallow, testSnapshotShallow } from '../testUtils';
import PeopleList from '../src/components/PeopleList';

LayoutAnimation.configureNext = jest.fn();

const orgs = [
  {
    id: 'personal',
    type: 'organization',
    expanded: false,
    people: [
      {
        id: 1,
        type: 'person',
      },
      {
        id: 2,
        type: 'person',
      },
      {
        id: 3,
        type: 'person',
      },
    ],
  },
  {
    id: 10,
    name: 'org 1',
    type: 'organization',
    expanded: false,
    people: [
      {
        id: 11,
        type: 'person',
      },
    ],
  },
  {
    id: 20,
    name: 'org 2',
    type: 'organization',
    expanded: false,
    people: [
      {
        id: 21,
        type: 'person',
      },
    ],
  },
];

it('renders correctly as Casey', () => {
  testSnapshotShallow(
    <PeopleList sections={false} items={orgs} onSelect={jest.fn()} />,
  );
});

it('renders correctly as Jean', () => {
  testSnapshotShallow(
    <PeopleList sections={true} items={orgs} onSelect={jest.fn()} />,
  );
});

describe('button presses', () => {
  let component;
  let componentInstance;

  beforeEach(() => {
    component = renderShallow(
      <PeopleList
        sections={true}
        items={orgs}
        onSelect={jest.fn()}
        onAddContact={jest.fn()}
      />,
    );

    componentInstance = component.instance();

    componentInstance.toggleSection = jest.fn();
  });

  it('onAddContact is called when add contact icon is pressed', () => {
    const addContactButton = component.find({ name: 'addContactIcon' }).first();
    const props = addContactButton.props();
    props.onPress.apply(null, props.pressProps);

    expect(componentInstance.props.onAddContact).toHaveBeenCalledWith(
      undefined,
    );
  });

  it('toggleSection is called when arrow icon is pressed', () => {
    componentInstance.setState = jest.fn();
    const arrowButton = component.find({ name: 'upArrowIcon' }).first();
    const props = arrowButton.props();
    props.onPress.apply(null, props.pressProps);

    expect(componentInstance.state.items[0]).toEqual({
      ...orgs[0],
      expanded: true,
    });
  });

  it('renders item', () => {
    const renderedItem = componentInstance.renderItem(orgs[0])({
      item: orgs[0].people[0],
    });
    expect(renderedItem).toMatchSnapshot();
  });
  it('should return key extractor', () => {
    const item = { id: '1' };
    const result = componentInstance.keyExtractor(item);
    expect(result).toEqual(item.id);
  });
});
