import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import * as navigation from '../../../actions/navigation';

import ContactJourney from '..';

import {
  createMockNavState,
  renderShallow,
  testSnapshot,
} from '../../../../testUtils';

const personId = '123';
const organizationId = 2;

const mockPerson = {
  id: personId,
  first_name: 'ben',
  organizational_permissions: [{ organization_id: organizationId }],
};

const mockJourneyList = [
  { _type: 'accepted_challenge', id: '84472', date: '2010-01-01 12:12:12' },
];

const mockAddComment = jest.fn(() => Promise.resolve());
const mockEditComment = jest.fn(() => Promise.resolve());
jest.mock('react-native-device-info');
jest.mock('../../../actions/interactions', () => ({
  addNewInteraction: () => mockAddComment,
  editComment: () => mockEditComment,
}));

let store;
let component;

const createMockStore = (id, personalJourney, isJean = true) => {
  const mockState = {
    auth: {
      person: {
        id,
      },
      isJean,
    },
    swipe: {
      journey: false,
    },
    journey: {
      personal: personalJourney,
    },
  };

  return configureStore([thunk])(mockState);
};

const org = { id: '123' };

const createComponent = props => {
  return renderShallow(
    <ContactJourney person={mockPerson} {...props} />,
    store,
  );
};

describe('ContactJourney', () => {
  it('renders loading screen correctly', () => {
    store = createMockStore(null, {});
    component = createComponent();

    expect(component).toMatchSnapshot();
  });

  it('renders null screen correctly', () => {
    store = createMockStore(personId, { [personId]: [] });
    component = createComponent();

    expect(component).toMatchSnapshot();
  });

  it('renders screen with steps correctly', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList });
    component = createComponent();

    expect(component).toMatchSnapshot();
  });

  it('renders screen as personal ministry', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList });
    component = createComponent();
    component.setState({ isPersonalMinistry: true });

    expect(component).toMatchSnapshot();
  });

  it('loads with personal ministry false', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList }, false);
    const instance = createComponent({ organization: org }).instance();

    expect(instance.state.isPersonalMinistry).toEqual(true);
  });

  it('loads with personal ministry true', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList });
    const instance = createComponent({ organization: org }).instance();

    expect(instance.state.isPersonalMinistry).toEqual(false);
  });

  it('loads with user_created true', () => {
    const userCreatedOrg = { ...org, user_created: true };
    store = createMockStore(personId, { [personId]: mockJourneyList });
    const instance = createComponent({
      organization: userCreatedOrg,
    }).instance();

    expect(instance.state.isPersonalMinistry).toEqual(false);
  });
});

describe('journey methods', () => {
  let component;
  beforeEach(() => {
    store = createMockStore(personId, { [personId]: mockJourneyList });
    component = createComponent().instance();
  });

  it('renders a step row', () => {
    const snap = component.renderRow({
      item: {
        id: '123',
        note: '123',
        _type: 'accepted_challenge',
      },
    });
    expect(snap).toMatchSnapshot();
  });

  it('renders an interaction row', () => {
    const snap = component.renderRow({
      item: {
        id: '123',
        comment: '123',
        _type: 'interaction',
      },
    });
    expect(snap).toMatchSnapshot();
  });

  it('renders a survey row', () => {
    const snap = component.renderRow({
      item: {
        id: '124',
        text: '124',
        _type: 'answer_sheet',
      },
    });
    expect(snap).toMatchSnapshot();
  });

  it('renders a stage change row', () => {
    const snap = component.renderRow({
      item: {
        id: '124',
        _type: 'pathway_progression_audit',
      },
    });
    expect(snap).toMatchSnapshot();
  });

  it('handles edit comment', () => {
    const comment = 'test';
    component.handleEditInteraction({ text: comment });

    component.handleEditComment(comment);

    expect(mockEditComment).toHaveBeenCalledTimes(1);
  });

  it('handles edit interaction', () => {
    navigation.navigatePush = jest.fn(screen => ({ type: screen }));
    component.handleEditInteraction({ id: 1 });

    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });

  it('should call list ref', () => {
    const ref = 'test';
    component.listRef(ref);

    expect(component.list).toEqual(ref);
  });

  it('should call key extractor', () => {
    const item = { id: '1', _type: 'test' };
    const result = component.keyExtractor(item);

    expect(result).toEqual(`${item.id}-${item._type}`);
  });
  it('should render item separator', () => {
    const renderedItem = component.itemSeparator(1, 1);

    expect(renderedItem).toMatchSnapshot();
  });
});

it('renders with an organization correctly', () => {
  testSnapshot(
    <Provider
      store={createMockStore(personId, { [personId]: mockJourneyList })}
    >
      <ContactJourney
        person={mockPerson}
        organization={{ id: 1 }}
        navigation={createMockNavState()}
      />
    </Provider>,
  );
});
