module.exports = {
  msv: {
    mission: 'Test',
    site: '',
    masterdb: false,
    view: ['0', '0', '0'],
    radius: {
      major: '3396190',
      minor: '3396190'
    },
    mapscale: ''
  },
  projection: {
    custom: false,
    epsg: '',
    proj: '',
    globeproj: 'webmercator',
    xmlpath: '',
    bounds: ['', '', '', ''],
    origin: ['', ''],
    reszoomlevel: '',
    resunitsperpixel: ''
  },
  look: {
    pagename: 'MMGIS',
    minimalist: false,
    topbar: true,
    toolbar: true,
    scalebar: true,
    coordinates: true,
    zoomcontrol: false,
    graticule: false,
    miscellaneous: true,
    bodycolor: '',
    topbarcolor: '',
    toolbarcolor: '',
    mapcolor: '',
    swap: true,
    copylink: true,
    screenshot: true,
    fullscreen: true,
    help: true,
    logourl: '',
    helpurl: ''
  },
  panels: ['viewer', 'map', 'globe'],
  time: ['enabled'],
  tools: [
    {
      name: 'Layers',
      icon: 'buffer',
      js: 'LayersTool'
    },
    {
      name: 'Legend',
      icon: 'format-list-bulleted-type',
      js: 'LegendTool'
    },
    {
      name: 'Info',
      icon: 'information-variant',
      js: 'InfoTool'
    },
    {
      name: 'Sites',
      icon: 'pin',
      js: 'SitesTool',
      variables: {
        sites: [
          {
            name: 'Site1',
            code: 'S1',
            view: [-4.667975771815966, 137.370253354311, 16]
          },
          {
            name: 'Site2',
            code: 'S2',
            view: [-4.667985128408622, 137.3702734708786, 20]
          }
        ]
      }
    },
    {
      name: 'Chemistry',
      icon: 'flask',
      js: 'ChemistryTool'
    },
    {
      name: 'Draw',
      icon: 'lead-pencil',
      js: 'DrawTool'
    },
    {
      name: 'FileManager',
      icon: 'folder-multiple',
      js: 'FileManagerTool'
    },
    {
      name: 'Identifier',
      icon: 'map-marker',
      js: 'IdentifierTool',
      variables: {
        'Tile with DEM': {
          url: 'Data/missionDEM.tif',
          unit: 'm'
        }
      }
    },
    {
      name: 'Measure',
      icon: 'chart-areaspline',
      js: 'MeasureTool',
      variables: {
        dem: 'Data/missionDEM.tif'
      }
    }
  ],
  layers: [
    {
      name: 'A Header',
      type: 'header',
      initialOpacity: 1,
      sublayers: [
        {
          name: 'S1 Drawings',
          kind: 'none',
          type: 'vector',
          url: 'Drawn/S1_speDrawings.geojson',
          tms: true,
          visibility: false,
          initialOpacity: 1,
          togglesWithHeader: true,
          style: {
            className: 's1drawings',
            color: 'undefined',
            fillColor: 'undefined',
            weight: null,
            fillOpacity: 1,
            opacity: 1
          },
          variables: {},
          radius: 1
        },
        {
          name: 'S2 Drawings',
          kind: 'none',
          type: 'vector',
          url: 'Drawn/S2_speDrawings.geojson',
          tms: true,
          visibility: false,
          initialOpacity: 1,
          togglesWithHeader: true,
          style: {
            className: 's2drawings',
            color: 'undefined',
            fillColor: 'undefined',
            weight: null,
            fillOpacity: 1,
            opacity: 1
          },
          variables: {},
          radius: 1
        },
        {
          name: 'ChemCam',
          kind: 'none',
          type: 'vector',
          url: 'Layers/ChemCam/chemcam.json',
          tms: true,
          visibility: true,
          visibilitycutoff: 17,
          initialOpacity: 1,
          togglesWithHeader: true,
          style: {
            className: 'chemcam',
            color: 'prop:color1',
            fillColor: 'prop:color3',
            weight: 2,
            fillOpacity: 1,
            opacity: 1
          },
          variables: {
            useKeyAsName: 'TARGET',
            chemistry: [
              'Al2O3',
              'CaO',
              'FeOT',
              'K2O',
              'MgO',
              'Na2O',
              'SiO2',
              'TiO2'
            ],
            search: '(TARGET)'
          },
          radius: 5
        },
        {
          name: 'Waypoints',
          kind: 'none',
          type: 'vector',
          url: 'Layers/Waypoints/waypoints.json',
          legend: 'Layers/Waypoints/legend.csv',
          tms: true,
          visibility: true,
          initialOpacity: 1,
          togglesWithHeader: true,
          style: {
            className: 'waypoints',
            color: 'white',
            fillColor: '#000',
            weight: 2,
            fillOpacity: 1,
            opacity: 1
          },
          variables: {},
          radius: 8
        },
        {
          name: 'Polygon',
          kind: 'none',
          type: 'vector',
          url: 'Layers/Polygon/polygon.geojson',
          tms: true,
          visibility: false,
          initialOpacity: 1,
          togglesWithHeader: true,
          style: {
            className: 'polygon',
            color: 'prop:somecolor',
            fillColor: 'prop:fill',
            weight: 2,
            fillOpacity: 0.7,
            opacity: 1
          },
          variables: {},
          radius: 4
        },
        {
          name: 'Line',
          kind: 'none',
          type: 'vector',
          url: 'Layers/Line/line.json',
          tms: true,
          visibility: false,
          initialOpacity: 1,
          togglesWithHeader: true,
          style: {
            className: 'line',
            color: 'white',
            fillColor: 'white',
            weight: 5,
            fillOpacity: 1,
            opacity: 1
          },
          variables: {},
          radius: 1
        },
        {
          name: 'Tile with DEM',
          type: 'tile',
          url: 'Layers/TilewithDEM/Gale_HiRISE/{z}/{x}/{y}.png',
          demtileurl: 'Layers/TilewithDEM/Gale_HiRISE_DEM/{z}/{x}/{y}.png',
          tms: true,
          visibility: true,
          initialOpacity: 1,
          togglesWithHeader: true,
          minZoom: 16,
          maxNativeZoom: 17,
          maxZoom: 22
        }
      ]
    }
  ]
}
