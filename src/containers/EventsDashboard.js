/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getVisbleEvents,
  getColorMap,
  getEvents,
  getEventsByDistrict,
  getFilteredEvents,
} from '../state/events/selectors';
import { startSetEvents } from '../state/events/actions';

import {
  getDistance,
  getLocation,
  getRefCode,
  getFilterBy,
  getFilterValue,
  getSearchType,
  getDistrict,
} from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import MapView from '../components/EventMap';
import SearchBar from './SearchBar';
import SideBar from './SideBar';

class EventsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.renderTotal = this.renderTotal.bind(this);

    this.state = {
      init: true,
    };
  }

  componentWillMount() {
    const {
      setRefCode,
    } = this.props;

    if (document.location.search) {
      setRefCode(document.location.search);
    }
  }

  componentDidMount() {
    const {
      getInitialEvents,
    } = this.props;
    getInitialEvents()
      .then((returned) => {
        this.props.setInitialFilters(returned);
        this.setState({ init: false });
      });
  }

  renderTotal(items) {
    return (<p className="event-count">
        Viewing {items.length} events
            </p>);
  }

  render() {
    const {
      allEvents,
      distance,
      district,
      visibleEvents,
      eventsByDistrict,
      center,
      colorMap,
      refcode,
      setLatLng,
      resetSelections,
      filterBy,
      filterValue,
      searchType,
      searchByDistrict,
      filteredEvents,
      searchByQueryString,
    } = this.props;
    if (this.state.init) {
      return null;
    }
    const searchTypeMapSideBar = {
      proximity: visibleEvents,
      district: eventsByDistrict,
    };
    const searchTypeMapMap = {
      proximity: visibleEvents,
      district: filteredEvents,
    };
    return (
      <div className="events-container main-container">
        <h2 className="dash-title">Event Dashboard</h2>
        <SearchBar items={searchTypeMapSideBar[searchType]} type="events" />
        <SideBar
          renderTotal={this.renderTotal}
          colorMap={colorMap}
          items={searchTypeMapSideBar[searchType]}
          allItems={allEvents}
          refcode={refcode}
          type="events"
          resetSelections={resetSelections}
        />
        <MapView
          items={searchTypeMapMap[searchType]}
          center={center}
          colorMap={colorMap}
          district={district}
          type="events"
          filterByValue={{ [filterBy]: [filterValue] }}
          resetSelections={resetSelections}
          searchByDistrict={searchByDistrict}
          refcode={refcode}
          setLatLng={setLatLng}
          distance={distance}
          searchType={searchType}
          searchByQueryString={searchByQueryString}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visibleEvents: getVisbleEvents(state),
  eventsByDistrict: getEventsByDistrict(state),
  filteredEvents: getFilteredEvents(state),
  district: getDistrict(state),
  allEvents: getEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
  refcode: getRefCode(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
  distance: getDistance(state),
  searchType: getSearchType(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialEvents: () => dispatch(startSetEvents()),
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  setLatLng: val => dispatch(selectionActions.setLatLng(val)),
  searchByDistrict: val => dispatch(selectionActions.searchByDistrict(val)),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
});

EventsDashboard.propTypes = {
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.shape({}),
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setInitialFilters: PropTypes.func.isRequired,
  setRefCode: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  getInitialEvents: PropTypes.func.isRequired,
  refcode: PropTypes.string,
  filterBy: PropTypes.string,
  filterValue: PropTypes.arrayOf(PropTypes.string),
};

EventsDashboard.defaultProps = {
  center: null,
  refcode: '',
  filterBy: 'all',
  filterValue: [],
  distance: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
