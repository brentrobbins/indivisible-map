import { createSelector } from 'reselect';

import { getFilterBy, getFilterValue } from '../selections/selectors';

export const getGroups = state => state.groups.allGroups;

export const getFilteredGroups = createSelector(
  [
    getGroups,
    getFilterBy,
    getFilterValue,
  ],
  (
    allGroups,
    filterBy,
    filterValue,
  ) => {
    if (filterBy === 'all') {
      return allGroups;
    }
    return allGroups.filter((currrentGroup) => {
      if (!currrentGroup[filterBy]) {
        return false;
      }
      if (filterBy === 'district') { // check if number
        return currrentGroup[filterBy] === filterValue;
      }
      return currrentGroup[filterBy].toLowerCase().includes(filterValue.toLowerCase());
    }).sort((a, b) => (a.starts_at < b.starts_at ? 1 : -1));
  },
);