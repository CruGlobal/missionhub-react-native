import {
  searchHandleToggle,
  searchSelectFilter,
  searchRemoveFilter,
  getFilterOptions,
} from '../../src/utils/filters';

describe('getFilterOptions', () => {
  const t = jest.fn(() => 'Title');

  it('sets the preview', () => {
    const filters = {
      '1234': { id: '1234', text: 'test', isAnswer: true },
      gender: { text: 'male' },
    };
    const results = getFilterOptions(t, filters);

    expect(results.questions.preview).toBe('test');
    expect(results.gender.preview).toBe('male');
    expect(results.time.preview).toBe(undefined);
  });

  it('sets the selected value', () => {
    const filters = {
      uncontacted: true,
      unassigned: true,
      archived: false,
    };
    const results = getFilterOptions(t, filters);

    expect(results.uncontacted.selected).toBe(true);
    expect(results.unassigned.selected).toBe(true);
    expect(results.archived.selected).toBe(false);
  });

  it('parses question content and sets question filter', () => {
    const questions = [
      {
        _type: 'choice_field',
        id: '1',
        label: 'Question 1',
        content: '1.1\r\n1.2\r\n1.3\r\n1.4',
      },
      {
        _type: 'text_field',
        id: '2',
        label: 'Question 2',
        content: '2.1\r\n2.2\r\n2.3\r\n2.4',
      },
      {
        _type: 'choice_field',
        id: '3',
        label: 'Question 3',
        content: '3.1\r\n3.2\r\n3.3\r\n3.4',
      },
    ];
    const filters = { '1': { id: '1', text: '1.1', isAnswer: true } };

    const results = getFilterOptions(t, filters, questions);

    expect(results.questions).toMatchSnapshot();
  });

  it('defines options for labels', () => {
    const labels = [
      { id: '1', name: 'label1' },
      { id: '2', name: 'label2' },
      { id: '3', name: 'label3' },
    ];
    const filters = { labels: { text: 'label3' } };

    const results = getFilterOptions(t, filters, [], labels);

    expect(results.labels).toMatchSnapshot();
  });
});

describe('searchHandleToggle', () => {
  const setState = jest.fn();
  const scope = {
    state: {
      toggleOptions: [
        { id: 'option1', selected: false },
        { id: 'option2', selected: true },
      ],
      filters: { filter1: { id: 'filter1' } },
    },
    props: {
      onFilter: jest.fn(),
    },
    setState,
  };
  const item = { id: 'option1', selected: false };

  it('toggles the selected option', () => {
    searchHandleToggle(scope, item);

    expect(setState).toHaveBeenCalledWith({
      toggleOptions: [
        { id: 'option1', selected: true },
        { id: 'option2', selected: true },
      ],
      filters: {
        filter1: { id: 'filter1' },
        option1: { id: 'option1', selected: true },
      },
    });
  });
});

describe('searchSelectFilter', () => {
  const setState = jest.fn();
  const scope = {
    state: {
      options: [
        { id: 'gender', text: 'Gender' },
        { id: 'option2', text: 'Option 2' },
      ],
      filters: { gender: { id: 'gender' } },
      selectedFilterId: 'gender',
    },
    props: {
      onFilter: jest.fn(),
    },
    setState,
  };

  it('sets the preview on the selected option', () => {
    const item = { id: 'gender', text: 'Male' };
    searchSelectFilter(scope, item);

    expect(setState).toHaveBeenCalledWith({
      options: [
        { id: 'gender', text: 'Gender', preview: 'Male' },
        { id: 'option2', text: 'Option 2' },
      ],
      filters: {
        gender: item,
      },
    });
  });

  it('removes the preview on the selected option', () => {
    const item = { id: 'any' };
    searchSelectFilter(scope, item);

    expect(setState).toHaveBeenCalledWith({
      options: [
        { id: 'gender', text: 'Gender' },
        { id: 'option2', text: 'Option 2' },
      ],
      filters: {},
    });
  });
});

describe('searchRemoveFilter', () => {
  const setState = jest.fn(function(a, b) {
    this.state = a;
    b();
  });
  const scope = {
    state: {
      filters: { gender: { id: 'gender' }, unassigned: { id: 'unassigned' } },
    },
    setState,
  };

  it('removes the filter', async () => {
    await searchRemoveFilter(scope, 'gender');

    expect(setState).toHaveBeenCalled();
    expect(scope.state).toEqual({
      filters: { unassigned: { id: 'unassigned' } },
    });
  });

  it('removes the filter and clears default results', async () => {
    await searchRemoveFilter(scope, 'gender', ['gender']);

    expect(setState).toHaveBeenCalled();
    expect(scope.state).toEqual({
      filters: { unassigned: { id: 'unassigned' } },
      defaultResults: [],
    });
  });
});
