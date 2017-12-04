import React from 'react';
import PropTypes from 'prop-types';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.addPopups = this.addPopups.bind(this);
    this.addLayer = this.addLayer.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
  }

  addPopups() {
    const { map } = this;
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['event-points'] });
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (!features.length) {
        popup.remove();
        return;
      }
      const feature = features[0];
      popup.setLngLat(feature.geometry.coordinates)
        .setHTML(`<h4>${feature.properties.title}</h4>`)
        .addTo(map);
    });
  }

  addLayer() {
    const {
      featuresHome,
    } = this.props;

    this.map.addLayer(
      {
        id: 'event-points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: featuresHome,
        },
        layout: {
          'icon-image': '{icon}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'icon-ignore-placement': true,
          'icon-offset': {
            base: 1,
            stops: [[0, [0, -15]], [10, [0, -10]], [12, [0, 0]]],
          },
        },
      },
      'district_interactive',
    );
  }

  initializeMap() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYWxhbjA0MCIsImEiOiJjamFrNm81dWkyZzMzMnhsZTI3bjR3eDVoIn0.K3FKPy6S_PwzjDjb02aGHA';
    const styleUrl = 'mapbox://styles/alan040/cjaqgutcnhdun2slmi3xbhgu1';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: styleUrl,
    });


    // Set Mapbox map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.scrollZoom.disable();
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    // map on 'load'
    this.map.on('load', () => {
      this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
      this.addLayer();
      this.addPopups();
      this.props.getEvents(this.map);
    });
  }


  render() {
    return (
      <div>
        <div id="map" />
        <div className="map-overlay" id="legend" />
      </div>
    );
  }
}

MapView.propTypes = {
  getEvents: PropTypes.func.isRequired,
  featuresHome: PropTypes.shape({
    type: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default MapView;
