const fs = require('fs')
async function download (file, toLocation) {
  fs.mkdirSync(toLocation.split('/').slice(0, -1).join('/'), { recursive: true })
  if (fs.existsSync(toLocation)) {
    console.log('File exists', toLocation)
    return
  } else {
    console.log('Downloading', file, 'to', toLocation)
  }
  // head to see if the file isn't too big (> 40MB)
  const head = await fetch(file, {
    headers: require('./headers.json'),
    body: null,
    method: 'HEAD'
  })
  if (head.headers.get('content-length') > 40 * 1024 * 1024) {
    console.log('Skipping file too big', file)
    return
  } else {
    console.log('File is small enough', file, head.headers.get('content-length'))
  }
  const data = await fetch(file, {
    // NOTE: headers has to be dumped from the browser, because downloading these files requires auth... and the auth is stored in the browser headers
    // this is bad but it's the fastest way to do it in <2hrs...
    headers: require('./headers.json'),
    body: null,
    method: 'GET'
  }).then(e => e.arrayBuffer())
  // write to file
  const buffer = Buffer.from(data)
  if (buffer.toString().includes('Access denied')) {
    throw new Error('Access denied')
  }
  fs.writeFileSync(toLocation, buffer)
}
// async function mockDownload (file, toLocation) {
//   console.log('Downloading', file, 'to', toLocation)
//   fs.mkdirSync(toLocation.split('/').slice(0, -1).join('/'), { recursive: true })
// }

async function getAsText (url) {
  return await fetch(url).then(response => response.text()).catch(e => null)
}

function getAllTheHrefs (html) {
  return html.match(/href="([^"]*)"/g)?.map(x => x.replace('href="', '').replace('"', ''))
}

const index = {}

async function downloadForDay (dataType, day) {
  console.log('Downloading', dataType, day)
  const indexData = await getAsText(`https://e4ftl01.cr.usgs.gov/ECOSTRESS/${dataType}/${day}`)
  if (!indexData) {
    console.log('No index data for day', day)
    return
  }
  // the XML file gives us location data and other metadata about the .h5 file
  const hrefs = getAllTheHrefs(indexData)?.filter(x => x.endsWith('.h5') || x.endsWith('.xml'))
  if (!hrefs?.length) {
    console.log('No hrefs for day', day)
    return
  }
  console.log('Index data for day', day, hrefs)

  for (let i = 0; i < hrefs.length; i += 2) {
    const h5 = hrefs[i]
    const xml = hrefs[i + 1]

    if (!xml.includes(h5)) {
      throw new Error('XML and H5 files do not match')
    }

    index[dataType] ??= {}
    index[dataType][day] ??= []
    index[dataType][day].push({
      h5,
      xml
    })
    await download(`https://e4ftl01.cr.usgs.gov/ECOSTRESS/${dataType}/${day}/${h5}`, `ecostress/${dataType}/${day}/${h5}`)
    await download(`https://e4ftl01.cr.usgs.gov/ECOSTRESS/${dataType}/${day}/${xml}`, `ecostress/${dataType}/${day}/${xml}`)
  }
}

async function main () {
  // basically download the root of the html index page, then go through all the links...
  // to save time, we are only going to grab one latest day 2023-10-07... but this can be trivially expanded
  const indexData = await getAsText('https://e4ftl01.cr.usgs.gov/ECOSTRESS/')
  const allTheHrefs = getAllTheHrefs(indexData).filter(x => x.startsWith('ECO'))

  console.log(allTheHrefs)
  for (const dataType of allTheHrefs) {
    const day = '2023.10.07'
    await downloadForDay(dataType.replace('/', ''), day)
  }

  fs.writeFileSync('ecostress/index.json', JSON.stringify(index, null, 2))
}

function makeIndexByPos () {
  const index = require('./ecostress/index.json')
  const indexByPos = {}

  for (const dataType in index) {
    for (const dayCode in index[dataType]) {
      const dayData = index[dataType][dayCode]
      for (const file of dayData) {
        const h5 = file.h5
        const xml = file.xml
        // console.log(file, `ecostress/${dataType}/${dayCode}/${h5}`)
        const h5Path = `ecostress/${dataType}/${dayCode}/${h5}`
        const xmlPath = `ecostress/${dataType}/${dayCode}/${xml}`
        if (fs.existsSync(h5Path) && fs.existsSync(xmlPath)) {
          console.log('Have both H5 and XML files for', dataType, dayCode)
          const bb = extractBBFromXML(fs.readFileSync(xmlPath, 'utf8'))
          if (bb) {
            console.log('BB', bb)
            const key = `${bb[0]},${bb[1]};${bb[2]},${bb[3]}`
            indexByPos[key] ??= []
            indexByPos[key].push({
              dataType,
              dayCode,
              h5,
              xml
            })
          }
        }
      }
    }
  }
  fs.writeFileSync('ecostress/indexByPos.json', JSON.stringify(indexByPos, null, 2))
}

function extractBBFromXML (xmlData) {
  /*  <BoundingRectangle>
      <WestBoundingCoordinate>-167.939484</WestBoundingCoordinate>
      <NorthBoundingCoordinate>53.389309</NorthBoundingCoordinate>
      <EastBoundingCoordinate>-161.428986</EastBoundingCoordinate>
      <SouthBoundingCoordinate>49.107025</SouthBoundingCoordinate>
  </BoundingRectangle> */
  // console.log(xmlData)
  try {
    const west = xmlData.match(/<WestBoundingCoordinate>([^<]*)<\/WestBoundingCoordinate>/)[1]
    const north = xmlData.match(/<NorthBoundingCoordinate>([^<]*)<\/NorthBoundingCoordinate>/)[1]
    const east = xmlData.match(/<EastBoundingCoordinate>([^<]*)<\/EastBoundingCoordinate>/)[1]
    const south = xmlData.match(/<SouthBoundingCoordinate>([^<]*)<\/SouthBoundingCoordinate>/)[1]
    return [west, north, east, south]
  } catch {
    return null // no bounding box
  }
}

function indexByPosToLayers () {
  const layers = {}
  const indexByPos = require('./ecostress/indexByPos.json')
  for (const key in indexByPos) {
    for (const data of indexByPos[key]) {
      console.log(data)
      const [start, end] = key.split(';')
      const [startX, startY] = start.split(',').map(parseFloat)
      const [endX, endY] = end.split(',').map(parseFloat)
      const geoJSONRect = {
        type: 'Feature',
        properties: {
          name: key,
          h5url: `https://github.com/zubearc/nasa-ecostress/blob/master/${data.dataType}/${data.dayCode}/${data.h5}`
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [startX, startY],
              [endX, startY],
              [endX, endY],
              [startX, endY],
              [startX, startY]
            ]
          ]
        }
      }
      layers[data.dataType] ??= []
      layers[data.dataType].push(geoJSONRect)
    }
  }
  const layersArray = []
  for (const key in layers) {
    layersArray.push({
      name: key,
      visibility: true,
      initialOpacity: 1,
      type: 'FeatureCollection',
      uuid: key,
      features: layers[key]
    })
  }
  fs.writeFileSync('layers.json', JSON.stringify(layersArray, null, 2))
}

// main()
// makeIndexByPos()
indexByPosToLayers()

module.exports = { main, makeIndexByPos }
