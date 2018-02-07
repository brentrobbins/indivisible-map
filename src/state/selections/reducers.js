import { uniqBy } from 'lodash';

const initialState = {
  filterValue: '',
  location: {},
  distance: 80467.2,
  filterBy: 'all',
  filters: 'init',
  zipcode: '',
  states: [],
  refcode: '',
};

const filtersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_REFCODE':
      return {
        ...state,
        refcode: payload,
      };
    case 'SET_TEXT_FILTER':
      return {
        ...state,
        filterValue: payload,
      };
    case 'SET_DISTANCE':
      return {
        ...state,
        distance: payload,
      };
    case 'SET_LAT_LNG':
      return {
        ...state,
        location: payload,
      };
    case 'SEARCH_BY_KEY_VALUE':
      return {
        ...state,
        filterBy: payload.filterBy,
        filterValue: payload.filterValue,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: payload,
      };
    case 'SET_INITIAL_FILTERS':
      return {
        ...state,
        filters: uniqBy(payload, 'issueFocus').map(item => item.issueFocus),
      };
    default:
      return state;
  }
};

export default filtersReducer;