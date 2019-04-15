'use strict'

import _ from 'lodash'

class simpleStyle {
  constructor(json) {
    this.json = json

    this.defaults = {
      title: '',
      description: '',
      'marker-size': 'medium',
      'marker-symbol': '',
      'marker-color': '#7e7e7e',
      stroke: '#555555',
      'stroke-opacity': 1.0,
      'stroke-width': 2,
      fill: '#7e7e7e',
      'fill-opacity': 0.6,
      minzoom: 0,
      maxzoom: 22,
    }
  }

  addTo(map) {
    const features = this.json.features
    for (let i = 0; i < features.length; i++) {
      const properties = { ...this.defaults, ...features[i].properties }
      features[i].properties = properties
    }

    const points = _.filter(features, feature => {
      if (feature.geometry && feature.geometry.type && 'Point' === feature.geometry.type) {
        return true
      }
    });

    map.addSource('simple-style-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points,
      },
    })

    map.addLayer({
      id: 'circle-simple-style-points',
      type: 'circle',
      source: 'simple-style-points',
      paint: {
        'circle-radius': [
          'case',
          ['==', 'small', ['get', 'marker-size']], 3,
          ['==', 'large', ['get', 'marker-size']], 11,
          7,
        ],
        'circle-color': ['get', 'marker-color'],
        'circle-opacity': ['to-number', ['get', 'fill-opacity']],
        'circle-stroke-width': ['to-number', ['get', 'stroke-width']],
        'circle-stroke-color': ['get', 'stroke'],
        'circle-stroke-opacity': ['to-number', ['get', 'stroke-opacity']],
      },
    })

    map.addLayer({
      id: 'symbol-simple-style-points',
      type: 'symbol',
      source: 'simple-style-points',
      paint: {
        'text-color': '#000000',
        'text-halo-color': 'rgba(255, 255, 255, 1)',
        'text-halo-width': 2,
      },
      layout: {
        'icon-image': ['get', 'marker-symbol'],
        'text-field': ['get', 'title'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 12,
        'text-anchor': 'top',
        'text-max-width': 12,
        'text-offset': [
          'case',
          ['==', 'small', ['get', 'marker-size']], ['literal', [0, 0.4]],
          ['==', 'large', ['get', 'marker-size']], ['literal', [0, 1]],
          ['literal', [0, 0.8]],
        ],
        'text-allow-overlap': false,
      },
    })
  }
}

export default simpleStyle
