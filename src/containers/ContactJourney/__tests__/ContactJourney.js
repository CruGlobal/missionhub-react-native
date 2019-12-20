import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as navigation from '../../../actions/navigation';
import { JOURNEY_EDIT_FLOW } from '../../../routes/constants';
import {
  ACCEPTED_STEP,
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
} from '../../../constants';
import {
  createMockNavState,
  renderShallow,
  testSnapshotShallow,
} from '../../../../testUtils';

import ContactJourney from '..';

const personId = '123';
const orgId = '222';

const mockPerson = {
  id: personId,
  first_name: 'ben',
  organizational_permissions: [{ organization_id: orgId }],
};

const mockJourneyList = [
  { _type: ACCEPTED_STEP, id: '84472', date: '2010-01-01 12:12:12' },
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

const org = { id: orgId };
const personalOrg = { id: 'personal' };
const userCreatedOrg = { ...org, user_created: true };

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
    component = createComponent({ organization: personalOrg });

    expect(component).toMatchSnapshot();
  });

  it('Not Jean, org is Personal', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList }, false);
    const instance = createComponent({ organization: personalOrg }).instance();

    expect(instance.state.isPersonalMinistry).toEqual(true);
  });

  it('Not Jean, org is User-Created', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList }, false);
    const instance = createComponent({
      organization: userCreatedOrg,
    }).instance();

    expect(instance.state.isPersonalMinistry).toEqual(true);
  });

  it('Is Jean, org is Personal', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList }, true);
    const instance = createComponent({ organization: personalOrg }).instance();

    expect(instance.state.isPersonalMinistry).toEqual(true);
  });

  it('Is Jean, org is Cru', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList }, true);
    const instance = createComponent({ organization: org }).instance();

    expect(instance.state.isPersonalMinistry).toEqual(false);
  });

  it('lIs Jean, org is User-Created', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList }, true);
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
    component = createComponent({ organization: org }).instance();
  });

  it('renders a step row', () => {
    const snap = component.renderRow({
      item: {
        id: '123',
        note: '123',
        _type: ACCEPTED_STEP,
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

  it('handles edit interaction for step', () => {
    const interactionId = '1';
    const interactionNote = 'note';

    navigation.navigatePush = jest.fn(screen => ({ type: screen }));
    component.handleEditInteraction({
      id: interactionId,
      note: interactionNote,
      _type: ACCEPTED_STEP,
    });

    expect(navigation.navigatePush).toHaveBeenCalledWith(JOURNEY_EDIT_FLOW, {
      id: interactionId,
      type: EDIT_JOURNEY_STEP,
      initialText: interactionNote,
      personId,
      orgId,
    });
  });

  it('handles edit interaction for other', () => {
    const interactionId = '1';
    const interactionComment = 'comment';

    navigation.navigatePush = jest.fn(screen => ({ type: screen }));
    component.handleEditInteraction({
      id: interactionId,
      comment: interactionComment,
      _type: 'other',
    });

    expect(navigation.navigatePush).toHaveBeenCalledWith(JOURNEY_EDIT_FLOW, {
      id: interactionId,
      type: EDIT_JOURNEY_ITEM,
      initialText: interactionComment,
      personId,
      orgId,
    });
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
  testSnapshotShallow(
    <ContactJourney
      person={mockPerson}
      organization={{ id: 1 }}
      navigation={createMockNavState()}
    />,
    createMockStore(personId, { [personId]: mockJourneyList }),
  );
});
