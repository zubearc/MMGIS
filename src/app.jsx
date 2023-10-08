/* eslint-disable react/jsx-closing-bracket-location, react/jsx-indent-props, react/jsx-closing-tag-location */
/* @jsx h */
import { Fragment, h, render } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function TopBar () {
  return (
    <div id='topBar' style='margin-left: 380px; width: calc(100% - 380px); padding-left: 0px;'>
      <div id='topBarLeft' class='hideScrollbar'>
        <div id='topBarMain'>
          <div id='topBarTitle'>
            <div id='topBarTitleName' tabindex='200'>MMGIS</div>
          </div>
        </div>
        <div id='topBarSecondary'>
          <div class='mainInfo' title='Go to featured item' style='display: flex; opacity: 1;' />
          <div class='mainDescription' title='Go to active item'>
            <p id='mainDescPoint'>
              <div
                id='mainDescPointInner' tabindex='300'
                style='display: flex; white-space: nowrap; line-height: 29px; color: var(--color-mw2); font-weight: bold; cursor: pointer; margin: 0px;'
              />
              <div
                id='mainDescPointLinks'
                style='display: flex; white-space: nowrap; line-height: 29px; font-size: 14px; color: rgb(170, 170, 170); font-weight: bold; cursor: pointer; margin: 0px;'
              />
            </p>
          </div>
        </div>
      </div>
      <div id='topBarRight'>
        <div class='Search'>
          <div id='Search' class='flexbetween' style='height: 100%; pointer-events: auto; position: relative;'>
            <div id='SearchType' class='ui dropdown short searchSelect' tabindex='400'>
              <dl class='dropy'>
                <dt class='dropy__title'>
                  <span>ChemCam</span>
                  <i class='mdi mdi-chevron-down mdi-18px' />
                </dt>
                <dd class='dropy__content'>
                  <ul>
                    <li><a class='dropy__header' style='pointer-events: none;'>Search Layer...</a></li>
                    <li><a class='selected' idx='0' title='ChemCam'>ChemCam</a></li>
                  </ul>
                </dd>
                <input type='hidden' name='first' />
              </dl>
            </div>
            <div>
              <input
                id='auto_search' class='topBarSearch' type='text' placeholder='TARGET' tabindex='401'
                autocomplete='off'
              />
            </div>
            <div id='SearchClear' style='margin-left: 0; mix-blend-mode: difference;'><i
              class='mdi mdi-close mdi-18px'
              tabindex='402'
            />
            </div>
            <div id='SearchBoth' style='margin-left: 0px; mix-blend-mode: difference; display: inherit;'><i
              class='mdi mdi-magnify mdi-18px' tabindex='403'
            />
            </div>
          </div>
        </div>
        <div id='loginDiv' style='display: flex; z-index: 2006; color: rgb(170, 170, 170); mix-blend-mode: luminosity;'>
          <div
            id='loginUser' title='admin'
            style='text-align: center; font-size: 12px; font-weight: bold; font-family: sans-serif; margin-left: 5px; cursor: pointer; width: 30px; height: 30px; line-height: 30px; color: white; background: var(--color-a); display: block; text-transform: uppercase; transition: opacity 0.2s ease-out 0s;'
          >
            a
          </div>
          <div id='loginoutButton' title='Logout' tabindex='500'><i
            id='loginoutButtonIcon'
            class='mdi mdi-logout mdi-18px'
          />
          </div>
        </div>
      </div>
    </div>
  )
}

function BottomBar ({ showSettingsModal, showKeysModal }) {
  function requestFullScreen () {
    const elem = document.getElementById('main-container')
    elem.requestFullscreen()
  }
  return (
    <div id='barBottom' style='position: absolute; width: 40px; bottom: 0px; left: 0px; display: flex; flex-flow: column; z-index: 1005;'>
      <i id='topBarLink' tabindex='100' class='mmgisHoverBlue mdi mdi-open-in-new mdi-18px' style='padding: 5px 10px; width: 40px; height: 36px; line-height: 26px; cursor: pointer; display: inherit;' />
      <i id='topBarScreenshot' title='Screenshot' tabindex='101' class='mmgisHoverBlue mdi mdi-camera mdi-18px' style='padding: 5px 10px; width: 40px; height: 36px; line-height: 26px; cursor: pointer; opacity: 0.8; display: inherit;'>
        <i
          id='topBarScreenshotLoading' title='Taking Screenshot...
You may need to permit multiple downloads in your browser.' tabindex='102' style='display: none; border-radius: 50%; border-width: 8px; border-style: solid; border-color: rgb(255, 225, 0) transparent; border-image: initial; position: relative; top: 3px; left: -17px; width: 20px; height: 20px; line-height: 26px; color: rgb(210, 184, 0); cursor: pointer; animation-name: rotate-forever; animation-duration: 2s; animation-iteration-count: infinite;' />
      </i>
      <i id='topBarFullscreen' tabindex='103' onClick={requestFullScreen} class='mmgisHoverBlue mdi mdi-fullscreen mdi-18px' style='padding: 5px 10px; width: 40px; height: 36px; line-height: 26px; cursor: pointer; display: inherit;' />
      <i id='bottomBarHotkeys' tabindex='104' onClick={showKeysModal} class='mmgisHoverBlue mdi mdi-keyboard mdi-18px' style='padding: 5px 10px; width: 40px; height: 36px; line-height: 26px; cursor: pointer;' />
      <i id='bottomBarSettings' tabindex='104' onClick={showSettingsModal} class='mmgisHoverBlue mdi mdi-settings mdi-18px' style='padding: 5px 10px; width: 40px; height: 36px; line-height: 26px; cursor: pointer; display: inherit;' />
      <i id='topBarInfo' title='Info' tabindex='105' class='mmgisHoverBlue mdi mdi-information-outline mdi-18px' style='padding: 5px 10px; width: 40px; height: 36px; line-height: 26px; cursor: pointer; display: none;' />
      <i id='topBarHelp' title='Help' tabindex='106' class='mmgisHoverBlue mdi mdi-help mdi-18px' style='padding: 5px 10px; width: 40px; height: 36px; line-height: 26px; cursor: pointer; display: none;' />
    </div>
  )
}

// When this element is clicked on and dragged, send drag information to the `fn` function
function createDragHandler (element, fn, release) {
  element.addEventListener('mousedown', function (e) {
    console.log('mousedown')
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10)
    const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10)
    const mouseMoveHandler = function (e) {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      fn(startWidth + dx, startHeight + dy)
    }
    const mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
      if (release) release()
    }
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  })
}

function createDraggable (element, parent, leftPadding = 0) {
  console.log(element)
  let timer, lastX, lastY // eslint-disable-line no-unused-vars
  // Move the tool panel based on the drag
  const initialWidth = parseInt(parent.style.width.replace('px', ''))
  let currentWidth = initialWidth
  function startUpdating () {
    timer = setInterval(() => {
      parent.style.width = `${Math.max(initialWidth, currentWidth + lastX)}px`
      // if (dontMoveEle) return
      element.style.left = `${currentWidth + leftPadding + lastX}px`
    }, 20)
  }
  function handleUpdate (x, y) {
    // make sure we don't wind X before the initial width
    if ((currentWidth + x) < initialWidth) {
      console.log(initialWidth, 'warning: x < 0', x, y)
      x = 0
    }
    // console.log(x, y)
    lastX = x
    lastY = y
    if (!timer) startUpdating()
  }
  function handleRelease () {
    clearInterval(timer)
    timer = null
    currentWidth = initialWidth + lastX
  }
  createDragHandler(element, handleUpdate, handleRelease)
}

function LayerTool ({ layers }) {
  useEffect(() => {
    let dragSrcEl = null
    function handleDragStart (e) {
      this.style.opacity = '0.4'

      dragSrcEl = this

      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/html', this.innerHTML)
    }

    function handleDragEnd (e) {
      this.style.opacity = '1'

      items.forEach(function (item) {
        item.classList.remove('over')
      })
    }

    function handleDragOver (e) {
      e.preventDefault()
      return false
    }

    function handleDragEnter (e) {
      this.classList.add('over')
    }

    function handleDragLeave (e) {
      this.classList.remove('over')
    }

    function handleDrop (e) {
      e.stopPropagation()
      if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML
        this.innerHTML = e.dataTransfer.getData('text/html')
      }
      return false
    }

    function registerDraggableElements (items) {
      items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart)
        item.addEventListener('dragover', handleDragOver)
        item.addEventListener('dragenter', handleDragEnter)
        item.addEventListener('dragleave', handleDragLeave)
        item.addEventListener('dragend', handleDragEnd)
        item.addEventListener('drop', handleDrop)
      })
    }
    const items = document.querySelectorAll('.panel-layers')
    registerDraggableElements(items)
  }, [])

  console.log('Layers are', layers)
  const layerElements = []
  for (const layer of layers) {
    layerElements.push(<ToolPanelLayer layerData={layer} name={layer.name} depth={0} />)
    for (const subLayer of layer.sublayers) {
      layerElements.push(<ToolPanelLayer layerData={layer} name={subLayer.name} depth={1} />)
    }
  }

  return (
    <div id='layersTool'>
      <div id='layersToolHeader'>
        <div id='filterLayers'>
          <div class='left'>
            <div id='title'>Layers</div>
            <div id='helpModal_LayersTool' class='mmgisButton5 mmgisHelpButton' title='Help'>
              <i class='mdi mdi-help-rhombus-outline mdi-18px' />
            </div>
          </div>
          <div class='right'>
            <div class='vector' type='vector' title='Hide/Show Vector Layers'>
              <i class='mdi mdi-vector-square mdi-18px' />
            </div>
            <div class='vectortile' type='vectortile' title='Hide/Show VectorTile Layers'>
              <i class='mdi mdi-grid mdi-18px' />
            </div>
            <div class='tile' type='tile' title='Hide/Show Raster Layers'><i class='mdi mdi-map-outline mdi-18px' /></div>
            <div class='query' type='query' title='Hide/Show Query Layers'><i class='mdi mdi-binoculars mdi-18px' /></div>
            <div class='data' type='data' title='Hide/Show Data Layers'><i class='mdi mdi-file-table mdi-18px' /></div>
            <div class='model' type='model' title='Hide/Show Model Layers'><i class='mdi mdi-cube-outline mdi-18px' /></div>
            <div class='visible' type='visible' title='Hide/Show Off Layers'><i class='mdi mdi-eye mdi-18px' /></div>
          </div>
        </div>
        <div id='searchLayers'>
          <i class='mdi mdi-magnify mdi-18px' />
          <input type='text' placeholder='Search Layers (# for tags)' autocomplete='off' />
          <div id='clear'><i class='mdi mdi-close mdi-18px' /></div>
          <div id='expand'><i class='mdi mdi-arrow-expand-vertical mdi-18px' /></div>
          <div id='collapse'><i class='mdi mdi-arrow-collapse-vertical mdi-18px' /></div>
        </div>
      </div>
      <div id='layersToolContent'>
        <ul id='layersToolList'>
          {
            layerElements
          }
          {/* <ToolPanelLayer name='A Header' depth={0} />
          <ToolPanelLayer name='S1 Drawings' depth={1} />
          <ToolPanelLayer name='S2 Drawings' />
          <ToolPanelLayer name='ChemCam' />
          <ToolPanelLayer name='Waypoints' />
          <ToolPanelLayer name='Polygon' />
          <ToolPanelLayer name='Line' />
          <ToolPanelLayer name='Tile with DEM' />
          <ToolPanelLayer name='Maps' /> */}
        </ul>
      </div>
    </div>
  )
}

function ToolPanelLayer ({ name, layerData, depth = 0 }) {
  const id = '34de02bf-cece-4e2d-b29a-48dadb5c4408'
  const parentId = 'f6561467-5b7c-407e-b008-ac667704a1c3'

  const [hasOpenSettings, setHasOpenSettings] = useState(false)

  const layerId = 'LayersTooluuid' + id
  function setDraggable (layerId, draggable) {
    const element = document.getElementById(layerId)
    element.draggable = draggable
  }

  // onMouseDown={() => { setDraggable(layerId, true) }} onMouseLeave={() => setDraggable(layerId, false)} onMouseUp={() => setDraggable(layerId, false)}
  return (
    <li id={'LayersTooluuid' + id} class={`panel-layers ${hasOpenSettings && 'gears_on'}`} draggable={!hasOpenSettings} type='vector' depth='1' name={id} parent={parentId} style='margin-bottom: 1px; overflow: hidden; height: auto; margin-top: 1px;'>
      <div class='title' id={'layerstartuuid' + id} style={`border-left: ${13 * depth}px solid var(--color-a);`}>
        <div class='layersToolColor vector'>
          <i class='mdi mdi-drag-vertical mdi-12px' />
        </div>
        <div class='checkboxcont'>
          <div class='checkbox off' />
        </div>
        <div class='layerName' title='S1 Drawings'>{name}</div>
        <div class='reload' title='Reload Layer'>
          <i class='mdi mdi-refresh mdi-18px' />
        </div>
        <div title='Download' class='layerDownload' id={'layerexportuuid' + id} stype='vector' layername={id}>
          <i class='mdi mdi-download mdi-18px' name='layerexport' />
        </div>
        <div title='Settings' class='gears' id={'layersettingsuuid' + id} onClick={() => setHasOpenSettings(!hasOpenSettings)} type='vector' layername={id}>
          <i class='mdi mdi-tune mdi-18px' name='layersettings' />
        </div>
        <div title='Information' class='LayersToolInfo' id={'layerinfouuid' + id} stype='vector' layername={id}>
          <i class='mdi mdi-information-outline mdi-18px' name='layerinfo' />
        </div>
      </div>
      <div>
        <div class='layerExport vector'>
          <ul>
            <li>
              <div class='layersToolExportSourceGeoJSON'>
                <div>Export GeoJSON </div>
              </div>
            </li>
          </ul>
        </div>
        {
          hasOpenSettings
            ? (
              <Fragment>
                {
                layerData.time && <div class='timeDisplay settings vector'>
                  <ul>
                    <li>
                      <div>
                        <div>Start Time</div>
                        <label class='starttime uuidfc8cddbf-daec-434d-8d70-98ec9a093ba2'>2022-08-10T00:00:00.000Z</label>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div>End Time</div>
                        <label class='endtime uuidfc8cddbf-daec-434d-8d70-98ec9a093ba2'>2023-10-30T00:00:00.000Z</label>
                      </div>
                    </li>
                  </ul>
                </div>
              }
                <div class='settings settingsmainvector'>
                  <div class='layerSettingsTitle'>
                    <div>Layer Settings</div>
                    <div class='reset' title='Reset Settings'>
                      <i class='mdi mdi-restore mdi-18px' />
                    </div>
                  </div>
                  <ul>
                    <li>
                      <div>
                        <div>Opacity</div>
                        <input class='transparencyslider slider2' layername='ba365157-1ba0-4c7e-9a3a-4bce7ad3ed13' type='range' min='0' max='1' step='0.01' value='0.7' default='0.7' />
                      </div>
                    </li>
                    <li>
                      <div>
                        <div>Brightness</div>
                        <input class='tilefilterslider slider2' filter='brightness' unit='%' layername='ba365157-1ba0-4c7e-9a3a-4bce7ad3ed13' type='range' min='0' max='3' step='0.05' value='1' default='1' />
                      </div>
                    </li>
                    <li>
                      <div>
                        <div>Contrast</div>
                        <input class='tilefilterslider slider2' filter='contrast' unit='%' layername='ba365157-1ba0-4c7e-9a3a-4bce7ad3ed13' type='range' min='0' max='4' step='0.05' value='1' default='1' />
                      </div>
                    </li>
                    <li>
                      <div>
                        <div>Saturation</div>
                        <input class='tilefilterslider slider2' filter='saturate' unit='%' layername='ba365157-1ba0-4c7e-9a3a-4bce7ad3ed13' type='range' min='0' max='4' step='0.05' value='1' default='1' />
                      </div>
                    </li>
                    <li>
                      <div>
                        <div>Blend</div>
                        <select class='tileblender dropdown' layername='ba365157-1ba0-4c7e-9a3a-4bce7ad3ed13'>
                          <option value='unset' selected=''>None</option>
                          <option value='color'>Color</option>
                          <option value='overlay'>Overlay</option>
                        </select>
                      </div>
                    </li>
                  </ul>
                </div>
              </Fragment>
              )
            : null
        }

      </div>

    </li>
  )
}

function InfoTool () {
  return (
    <div id='infoTool'>
      <div id='infoToolHeader'>
        <div class='left'>
          <div id='infoToolTitle'>Info</div>
          <div id='helpModal_InfoTool' class='mmgisButton5 mmgisHelpButton' title='Help'><i class='mdi mdi-help-rhombus-outline mdi-18px' /></div>
          <div id='infoToolEquiv' title='Number of overlapping features' />
        </div>
        <div class='right' style='display: none;'>
          <div id='infoToolUnhideAll' title='Reshow All Hidden Features' style='display: none;'>
            <i class='mdi mdi-eye-check mdi-18px' />
          </div>
          <div id='infoToolHide' title='Hide/Show Feature'>
            <i class='mdi mdi-eye mdi-18px' />
          </div>
          <div id='infoToolDownload' title='Copy Feature to Clipboard'>
            <i class='mdi mdi-clipboard-outline mdi-18px' />
          </div>
          <div id='infoToolLocate' title='Locate on Map'>
            <i class='mdi mdi-crosshairs-gps mdi-18px' />
          </div>
        </div>
      </div>
      <div id='infoToolSelected' style='display: none;'>
        <div id='infoToolSelectedDropdown' />
      </div>
      <div id='infoToolFilter' style='display: none;'>
        <input type='text' placeholder='Filter' />
        <i class='mdi mdi-filter-variant mdi-18px' />
        <div id='infoToolShowHidden' title='Toggle Hidden Properties'>
          <i class='mdi mdi-book-outline mdi-18px' />
        </div>
      </div>
      <div id='infoToolContent'>
        <ul id='infoToolData' />
        <div id='infoToolNoneSelected' style='display: block;'>No feature selected</div>
      </div>
    </div>
  )
}

function SitesTool () {
  return (
    <Fragment>
      <div style='height: 40px; line-height: 40px; font-size: 16px; color: var(--color-l); background: var(--color-a); font-family: lato-light; text-transform: uppercase; padding-left: 6px;'>Sites</div>
      <div id='SitesTool' class='mmgisScrollbar' style='color: rgb(207, 207, 207); height: 100%; overflow-y: auto;'>
        <div class='mmgisRadioBar2 sitesRadio'>
          <div id='S1_tool_site' class='active'>Site1</div>
          <div id='S2_tool_site'>Site2</div>
        </div>
      </div>
    </Fragment>
  )
}

function ToolPanel ({ shownTool, missionData }) {
  useEffect(() => {
    const element = document.getElementById('toolPanelDrag')
    const parent = document.getElementById('toolPanel')
    createDraggable(element, parent, 10)

    const ele2 = document.getElementById('mapSplit')
    const par2 = document.getElementById('viewerScreen')
    createDraggable(ele2, par2, -8.5)
  })

  return (
    <Fragment>
      <div id='toolPanel' style='position: absolute; width: 340px; top: 0px; height: 100%; left: 40px; background: var(--color-k); transition: width 0.2s ease-out 0s; overflow: hidden; z-index: 1400;'>
        <div style='height: 100%;'>
          {shownTool === 'layer' ? <LayerTool layers={missionData.layers} /> : null}
          {shownTool === 'info' ? <InfoTool /> : null}
          {shownTool === 'sites' ? <SitesTool /> : null}
        </div>
      </div>
      {/* TODO: Figure out what this does */}
      <div id='toolPanelDrag' style='position: absolute; width: 24px; height: 28px; padding: 10px 2px; margin: 0px 3px; text-align: center; top: 1px; color: var(--color-a3); overflow: hidden; cursor: col-resize; display: block; z-index: 1400; border-right: 1px solid transparent; left: 350px;'>
        <div><i class='mdi mdi-drag-vertical mdi-18px' /></div>
      </div>
    </Fragment>
  )
}

function ToolBar ({ shownTool, setShownTool }) {
  return (
    <div
      id='toolbar'
      style='width: 40px; padding-top: 40px; background: var(--color-a); border-right: 1px solid var(--color-a-5); top: 0px; height: 100%; z-index: 1004;'
    >
      <div id='toolbarTools' style='height: 100%;'>
        <div
          id='toolcontroller_incdiv' class='sixteen wide column'
          style='transition: all 0.25s ease-in 0s; pointer-events: auto; opacity: 1; padding-bottom: 8px;'
        >
          <div
            id='toolButtonLayers' tabindex='1'
            onClick={() => setShownTool('layer')}
            class={'toolButton ' + (shownTool === 'layer' ? 'active' : '')}
          >
            <i id='LayersTool' class='mdi mdi-buffer mdi-18px active' style='cursor: pointer; color: var(--color-mmgis);' />
          </div>
          <div
            id='toolButtonInfo' tabindex='3'
            onClick={() => setShownTool('info')}
            class={'toolButton ' + (shownTool === 'info' ? 'active' : '')}
          >
            <i id='InfoTool' class='mdi mdi-information-variant mdi-18px' style='cursor: pointer;' />
          </div>
          <div
            id='toolButtonSites' tabindex='4'
            onClick={() => setShownTool('sites')}
            class={'toolButton ' + (shownTool === 'sites' ? 'active' : '')}
          >
            <i id='SitesTool' class='mdi mdi-pin mdi-18px' style='cursor: pointer;' />
          </div>
          {/* <div
            id='toolButtonChemistry' class='toolButton' tabindex='5'
            onClick={() => setShownTool('chemistry')}
            style='width: 100%; height: 36px; display: inline-block; text-align: center; line-height: 36px; border-top: none; border-bottom: 1px solid var(--color-a-5); vertical-align: middle; cursor: pointer; transition: all 0.2s ease-in 0s; color: var(--color-f);'
          >
            <i id='ChemistryTool' class='mdi mdi-flask mdi-18px' style='cursor: pointer;' />
          </div> */}
          {/* <div
            id='toolButtonIdentifier' tabindex='6'
            onClick={() => setShownTool('identifier')}
            class={'toolButton ' + (shownTool === 'identifier' ? 'active' : '')}
          >
            <i id='IdentifierTool' class='mdi mdi-map-marker mdi-18px' style='cursor: pointer;' />
          </div> */}
          {/* <div
            id='toolButtonMeasure' tabindex='7'
            onClick={() => setShownTool('measure')}
            class={'toolButton ' + (shownTool === 'measure' ? 'active' : '')}
          >
            <i id='MeasureTool' class='mdi mdi-chart-areaspline mdi-18px' style='cursor: pointer;' />
          </div>
          <div
            id='toolButtonDraw' tabindex='8'
            onClick={() => setShownTool('draw')}
            class={'toolButton ' + (shownTool === 'draw' ? 'active' : '')}
          >
            <i id='DrawTool' class='mdi mdi-lead-pencil mdi-18px' style='cursor: pointer;' />
          </div> */}
        </div>
      </div>
    </div>
  )
}

function ToolContainer ({ missionData }) {
  const [shownTool, setShownTool] = useState('layer')

  return (
    <Fragment>
      <ToolPanel shownTool={shownTool} missionData={missionData} />
      <ToolBar shownTool={shownTool} setShownTool={setShownTool} />
    </Fragment>
  )
}

function SplitScreens () {
  useEffect(() => {
    // Initialize a Map on #map ID with OSM basemap
    const map = L.map('map').setView([51.505, -0.09], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    const ele = document.getElementById('mapSplitInnerLeft')
    ele.onclick = function () {
      const ele2 = document.getElementById('mapSplit')
      const par2 = document.getElementById('viewerScreen')
      ele2.style.left = '-8.5px'
      par2.style.width = '0px'
    }

    const ele3 = document.getElementById('mapSplitInnerRight')
    ele3.onclick = function () {
      const ele4 = document.getElementById('mapSplit')
      const par4 = document.getElementById('viewerScreen')
      ele4.style.left = '391.5px'
      par4.style.width = '400px'
    }
  }, [])

  return (
    <div id='splitscreens' style='position: absolute; top: 0px; width: calc(100% - 380px); height: 100%; left: 380px;'>
      <div id='vmgScreen'>
        <div id='viewerScreen' style='position: absolute; width: 0px; height: 100%; z-index: 1000; top: 0px; overflow: hidden; left: 0px;'>
          <div id='viewer' style='position: absolute; background-color: var(--color-a-5); width: 100%; height: 100%;'>
            <div
              id='imageViewerMap'
              style='position: absolute; width: 100%; height: 100%; display: none; cursor: crosshair;'
            >
              <div
                class='openseadragon-container'
                style='background: none transparent; border: none; margin: 0px; padding: 0px; position: relative; width: 100%; height: 100%; overflow: hidden; left: 0px; top: 0px; text-align: left;'
              >
                <div
                  class='openseadragon-canvas' tabindex='0' dir='ltr'
                  style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; width: 100%; height: 100%; overflow: hidden; top: 0px; left: 0px; touch-action: none; text-align: left;'
                >
                  <canvas
                    width='1' height='1'
                    style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; width: 100%; height: 100%;'
                  />
                  <div style='background: none transparent; border: none; margin: 0px; padding: 0px; position: static;' />
                </div>
                <div
                  style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; left: 0px; top: 0px;'
                />
                <div
                  style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; right: 0px; top: 0px;'
                />
                <div
                  style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; right: 0px; bottom: 0px;'
                />
                <div
                  style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; left: 0px; bottom: 0px;'
                />
                <div
                  style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; top: calc(100% - 135px); left: 12px; height: 128px; width: 128px; opacity: 0;'
                >
                  <div
                    id='navigator-1696703191232' class=' navigator'
                    style='background: rgb(0, 0, 0); border: 2px solid rgb(85, 85, 85); margin: 0px; padding: 0px; position: relative; touch-action: none; opacity: 0.8; overflow: hidden; top: 0px; left: 0px; height: 100%; width: 100%; display: inline-block;'
                  >
                    <div
                      class='openseadragon-container'
                      style='background: none transparent; border: none; margin: 0px; padding: 0px; position: relative; width: 100%; height: 100%; overflow: hidden; left: 0px; top: 0px; text-align: left;'
                    >
                      <div
                        class='openseadragon-canvas' tabindex='-1' dir='ltr'
                        style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; width: 100%; height: 100%; overflow: hidden; top: 0px; left: 0px; touch-action: none; text-align: left;'
                      >
                        <canvas
                          width='1' height='1'
                          style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; width: 100%; height: 100%;'
                        />
                        <div
                          style='background: none transparent; border: none; margin: 0px; padding: 0px; position: static;'
                        />
                      </div>
                      <div
                        style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; left: 0px; top: 0px;'
                      />
                      <div
                        style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; right: 0px; top: 0px;'
                      />
                      <div
                        style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; right: 0px; bottom: 0px;'
                      />
                      <div
                        style='background: none transparent; border: none; margin: 0px; padding: 0px; position: absolute; left: 0px; bottom: 0px;'
                      />
                      <div
                        id='navigator-1696703191232-displayregioncontainer' class='displayregioncontainer'
                        style='background: none transparent; border: none; margin: 0px; padding: 0px; position: static; width: 100%; height: 100%; transform: rotate(0deg);'
                      >
                        <div
                          id='navigator-1696703191232-displayregion' class='displayregion'
                          style='background: transparent; border: 2px solid rgb(153, 0, 0); margin: 0px; padding: 0px; position: relative; top: -32px; left: -20px; font-size: 0px; overflow: hidden; float: left; z-index: 999999999; cursor: default; transform: rotate(0deg); display: block; width: 172px; height: 172px;'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id='imagePanoramaWebGL'
              style='position: absolute; width: 100%; height: 100%; display: inherit; touch-action: none; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);'
            >
              <button id='viewerDeviceOrientationButton'><i
                class='mdi mdi-screen-rotation mdi-24px'
                style='transition: all 0.2s ease-in 0s; cursor: pointer;'
              />
                <div style='line-height: 27px;' />
              </button><a /><canvas width='0' height='607' style='width: 0px; height: 486px;' />
              <div id='photosphereAzIndicator' title='Toggle az/el crosshairs'>Az: 180.00°, El: -0.00°</div>
              <div id='photosphereElIndicator' />
            </div>
            <div id='imageModelWebGL' style='position: absolute; width: 100%; height: 100%; display: none;'><a /><canvas
              width='0' height='0' style='width: 0px; height: 0px;'
            />
            </div>
            <div id='imageViewerIntro' style='position: absolute; width: 100%; height: 100%; display: none;'>
              <div
                style='position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); width: 200px; text-align: center;'
              >
                To begin, select any imagery-enabled feature.
              </div>
            </div>
            <div id='viewer_loading' style='opacity: 0;'>Loading</div>
          </div>
          <div
            id='viewerToolBar'
            style='position: absolute; top: 40px; width: 100%; height: 48px; pointer-events: none; z-index: 5; padding-left: 36px;'
          >
            <div>
              <div
                class='row childpointerevents'
                style='display: flex; justify-content: space-between; padding: 0px 5px;'
              >
                <div>
                  <div class='osd-custom-buttons' style='display: none;'>
                    <div id='osd-zoomin' title='Zoom in' style='display: inline-block; position: relative;'><i
                      class='mdi mdi-plus mdi-18px'
                    />
                    </div>
                    <div id='osd-zoomout' title='Zoom out' style='display: inline-block; position: relative;'><i
                      class='mdi mdi-minus mdi-18px'
                    />
                    </div>
                    <div id='osd-home' title='Go home' style='display: inline-block; position: relative;'><i
                      class='mdi mdi-home-variant-outline mdi-18px'
                    />
                    </div>
                    <div id='osd-settings' style='display: flex; width: auto; padding: 0px 6px;'>
                      <div>
                        <div
                          id='Viewer_Settings' class='mmgisButton3' title='Link'
                          style='height: unset; line-height: 24px; margin: unset; padding-left: unset; padding-right: unset; border-radius: unset;'
                        >
                          <i class='mdi mdi-tune mdi-18px' />
                        </div>
                        <div
                          id='Viewer_SettingsSettings' class='mmgisButton3'
                          style='height: unset; line-height: 24px; margin: unset; padding-left: unset; padding-right: unset; border-radius: unset;'
                        >
                          <i class='mdi mdi-menu-down mdi-18px' />
                        </div>
                        <div
                          id='Viewer_SettingsReset' class='mmgisButton3'
                          style='display: none; height: unset; line-height: 24px; margin: unset; padding-left: unset; padding-right: unset; border-radius: unset;'
                        >
                          <i class='mdi mdi-refresh mdi-18px' />
                        </div>
                        <div
                          id='Viewer_SettingsSettingsPanel'
                          style='display: none; position: absolute; top: 27px; background: var(--color-a); width: 42px; margin-left: 6px;'
                        >
                          <ul
                            style='position: absolute; left: -12px; list-style-type: none; margin: 0; padding: 8px 8px 5px 8px; border-radius: 3px; width: 220px; background: var(--color-a);'
                          >
                            <li style='height: 19px; line-height: 19px;'>
                              <div style='display: flex; justify-content: space-between;'>
                                <div style='font-size: 13px;'>Rotation</div><input
                                  class='viewer_rotationslider slider2'
                                  style='background: #444444; width: 120px;' type='range' min='0' max='360' step='1'
                                  value='0' default='0'
                                />
                              </div>
                            </li>
                            <li style='height: 19px; line-height: 19px;'>
                              <div style='display: flex; justify-content: space-between;'>
                                <div style='font-size: 13px;'>Brightness</div><input
                                  class='viewer_filterslider viewer_filterslider_brightness slider2'
                                  style='background: #444444; width: 120px;' type='range' min='0.25' max='2' step='0.05'
                                  value='1' default='1'
                                />
                              </div>
                            </li>
                            <li style='height: 19px; line-height: 19px;'>
                              <div style='display: flex; justify-content: space-between;'>
                                <div style='font-size: 13px;'>Contrast</div><input
                                  class='viewer_filterslider viewer_filterslider_contrast slider2'
                                  style='background: #444444; width: 120px;' type='range' min='0.25' max='6' step='0.05'
                                  value='1' default='1'
                                />
                              </div>
                            </li>
                            <li style='height: 19px; line-height: 19px;'>
                              <div style='display: flex; justify-content: space-between;'>
                                <div style='font-size: 13px;'>Saturation</div><input
                                  class='viewer_filterslider viewer_filterslider_saturate slider2'
                                  style='background: #444444; width: 120px;' type='range' min='0' max='2' step='0.05'
                                  value='1' default='1'
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div />
                      </div>
                    </div>
                  </div>
                </div>
                <div id='viewer_dropdownselector'>
                  <dl class='dropy'>
                    <dt class='dropy__title'>
                      <span class='selected'>Panorama Example [Panoramic]</span>
                      <i class='mdi mdi-chevron-down mdi-18px' />
                    </dt>
                    <dd class='dropy__content'>
                      <ul>
                        <li><a class='dropy__header' style='pointer-events: none;'>Panorama Example [Panoramic]</a></li>
                        <li><a class='selected' idx='0' title='Panorama Example [Panoramic]'>Panorama Example
                          [Panoramic]
                        </a>
                        </li>
                        <li><a idx='1' title='Panorama Example' class=''>Panorama Example</a></li>
                        <li><a idx='2' title='Model Example [Model]' class=''>Model Example [Model]</a></li>
                        <li><a idx='3' title='Image Example 1' class=''>Image Example 1</a></li>
                        <li><a idx='4' title='Image Example 2' class=''>Image Example 2</a></li>
                      </ul>
                    </dd>
                    <input type='hidden' name='first' value='' />
                  </dl>
                </div>
                <div id='viewer_Help'>Rotate - Left Click and Drag<br />Zoom - Mouse Wheel</div>
              </div>
            </div>
          </div>
        </div>
        <div class='splitterV' id='viewerSplit' style='width: 0px; height: 100%; left: 0px; cursor: default;' />
        <div id='mapScreen' style='position: absolute; width: 100%; height: 100%; top: 0px; left: 0px;'>
          <div id='map'>((MAP HERE))</div>
          <div
            id='mapToolBar'
            style='position: absolute; bottom: 0px; width: 100%; height: 40px; pointer-events: none; overflow: hidden; z-index: 1003; transition: bottom 0.2s ease-out 0s;'
          >
            <div class='row childpointerevents' style='height: 100%;'>
              <div id='scaleBarBounds' style='width: 270px; height: 36px;'><svg id='scaleBar' width='270px' height='36px'>
                <g
                  id='scale_axis_xL' transform='translate(12, 8)' fill='none' font-size='10' font-family='sans-serif'
                  text-anchor='middle'
                  style='fill: rgb(220, 220, 220); font-size: 14px; font-weight: bold; position: absolute;'
                >
                  <g class='tick' opacity='1' transform='translate(0,0)'><text
                    fill='currentColor' y='11' dy='0.71em'
                    style='fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0); stroke-width: 3px; paint-order: stroke;'
                  >0
                  </text>
                  </g>
                  <g class='tick' opacity='1' transform='translate(144.18291961967523,0)'><text
                    fill='currentColor'
                    y='11' dy='0.71em'
                    style='fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0); stroke-width: 3px; paint-order: stroke;'
                  >2000km
                  </text>
                  </g>
                  <line
                    x1='0' y1='0' x2='144.18291961967523' y2='0'
                    style='stroke: rgb(22, 22, 22); stroke-width: 14px;'
                  />
                  <line
                    x1='0' y1='0' x2='144.18291961967523' y2='0'
                    style='stroke: rgb(220, 220, 220); stroke-width: 10px;'
                  />
                </g>
                <g
                  id='scale_axis_xS' transform='translate(12, 8)' fill='none' font-size='10' font-family='sans-serif'
                  text-anchor='middle' style='fill: rgb(220, 220, 220); font-size: 14px; font-weight: bold;'
                >
                  <g class='tick' opacity='1' transform='translate(0,0)'><text
                    fill='currentColor' y='11' dy='0.71em'
                    style='fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0); stroke-width: 3px; paint-order: stroke;'
                  >0
                  </text>
                  </g>
                </g>
              </svg>
              </div>
            </div>
          </div>
          <div
            id='mapTopBar'
            style='z-index: 400; display: flex; justify-content: space-between; position: absolute; top: 0px; pointer-events: none; width: 100%; height: 40px; left: 0px; background: transparent; font-family: sans-serif; font-size: 24px; padding: 5px;'
          />
          <div
            id='scaleBox' class='unselectable'
            style='position: absolute; top: 0px; left: 0px; background: rgb(238, 238, 238); border: 1px solid black; cursor: move; opacity: 0.7; display: none; z-index: 1010;'
          />
          <div
            id='scaleBoxPopup' class='unselectable'
            style='position: absolute; top: 0px; left: 0px; width: 200px; opacity: 0.9; pointer-events: none; display: none; z-index: 1011;'
          >
            <div class='center aligned middle aligned ui padded grid' style='display: flex; justify-content: center;'>
              <div
                class='ui mini right labeled input'
                style='display: flex; padding: 0; pointer-events: auto; height: 24px; background: var(--color-a);'
              ><input
                  id='scaleboxX' type='number' placeholder='w' size='4' style='width: 60px; height: 24px; padding: 3px;'
                />
                <div
                  class='ui basic label'
                  style='padding-left: 4px; padding-right: 4px; line-height: 22px; color: var(--color-f);'
                >m
                </div>
              </div>
              <p
                style='font-size: 20px; padding: 0px 3px 0px 3px; margin: 0; color: white; line-height: 24px; text-shadow: -1px 1px 2px #000, 1px 1px 2px #000, 1px -1px 0 #000, -1px -1px 0 #000;'
              >
                ×
              </p>
              <div
                class='ui mini right labeled input'
                style='display: flex; padding: 0; pointer-events: auto; height: 24px; background: var(--color-a);'
              ><input
                  id='scaleboxY' type='number' placeholder='h' size='4' style='width: 60px; height: 24px; padding: 3px'
                />
                <div
                  class='ui basic label'
                  style='padding-left: 4px; padding-right: 4px; line-height: 22px; color: var(--color-f);'
                >m
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='splitterV' id='mapSplit' style='width: 17px; height: 100%; left: -8.5px; z-index:3000;'>
          <div class='splitterVInner' id='mapSplitInner' style='width: 34px;'>
            <div
              style='background: var(--color-a); width: 30px; height: 30px; position: absolute; left: -19px; z-index: -1;'
            /><i
              id='mapSplitInnerLeft' tabindex='500' class='mdi mdi-chevron-double-left mdi-24px'
              style='transition: all 0.2s ease-in 0s; margin-right: 9px;'
            />
            <div
              style='background: var(--color-a); width: 30px; height: 30px; position: absolute; left: 23px; z-index: -1;'
            /><i
              id='mapSplitInnerRight' tabindex='501' class='mdi mdi-chevron-double-right mdi-24px'
              style='transition: all 0.2s ease-in 0s; margin-left: 9px;'
            />
            <div id='mapSplitInnerViewerInfo'>Viewer</div>
          </div>
        </div>
        {/* <div id='globeScreen'>(GLOBE SCREEN)</div> */}
        {/* <div class='splitterV' id='globeSplit' style='width: 17px; height: 485.6px; left: 1147.5px;'>
          <div class='splitterVInner' id='globeSplitInner' style='width: 34px;'>
            <div
              style='background: var(--color-a); width: 30px; height: 30px; position: absolute; left: -18px; z-index: -1;'
            /><i
              id='globeSplitInnerLeft' tabindex='502' class='mdi mdi-chevron-double-left mdi-24px'
              style='transition: all 0.2s ease-in 0s; margin-right: 8px;'
            />
            <div
              style='background: var(--color-a); width: 30px; height: 30px; position: absolute; left: 22px; z-index: -1;'
            /><i
              id='globeSplitInnerRight' tabindex='503' class='mdi mdi-chevron-double-right mdi-24px'
              style='transition: all 0.2s ease-in 0s; margin-left: 8px;'
            />
            <div id='mapSplitInnerGlobeInfo'>Globe</div>
          </div>
        </div> */}
      </div>
      <div id='tScreen'>
        <div
          id='toolsWrapper'
          style='height: 0px; width: 340px; margin: 0px; background: var(--color-a); left: 0px; bottom: 0px; z-index: 1003;'
        >
          <div id='tools' style='position: absolute; top: 0px; height: 100%; padding-bottom: 0px; width: 100%;'>
            {/* TODO: Chemistry */}
          </div>
          <div class='splitterH' id='toolsSplit' style='height: 0px; left: 0px; bottom: 0px; z-index: 3;' />
        </div>
      </div>
      <div id='toolcontroller_sepdiv' style='position: absolute; top: 40px; left: 0px; margin-left: 6px; z-index: 1004;'>
        <div id='toolSeparated_Legend' style='position: relative; border-radius: 3px; background: var(--color-a);'>
          <div
            id='toolContentSeparated_Legend'
            style='position: absolute; top: 0px; left: 0px; border-radius: 3px; background: var(--color-k);'
          />
          <div
            id='toolButtonSeparated_Legend' class='toolButtonSep' tabindex='2'
            style='position: relative; width: 30px; height: 30px; display: inline-block; text-align: center; line-height: 30px; vertical-align: middle; cursor: pointer; transition: all 0.2s ease-in 0s; color: var(--color-f);'
          >
            <i id='LegendTool' class='mdi mdi-format-list-bulleted-type mdi-18px' style='cursor: pointer;' />
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsModal ({ dismissModal }) {
  return (
    <div id='mmgisModal_0' class='mmgisModal dontCloseWhenClicked' style='opacity: 1;'>
      <div id='mmgisModalClose'><i class='mdi mdi-close mdi-24px' /></div>
      <div id='mmgisModalInner'>
        <div id='mainSettingsModal'>
          <div id='mainSettingsModalTitle'>
            <div><i class='mdi mdi-settings mdi-18px' /><div>Settings</div></div>
            <div id='mainSettingsModalClose' onClick={dismissModal}><i class='mmgisHoverBlue mdi mdi-close mdi-18px' /></div>
          </div>
          <div id='mainSettingsModalContent'>
            <div class='mainSettingsModalSection' id='mainSettingsModalSectionUIVisibility'>
              <div class='mainSettingsModalSectionTitle'>User Interface Visibility</div>
              <ul class='mainSettingsModalSectionOptions'>
                <li>
                  <div class='mmgis-checkbox'><input type='checkbox' checked='' id='checkbox_msmsUIV1' value='topbar' /><label for='checkbox_msmsUIV1' /></div>
                  <div>Top Bar</div>
                </li>
                <li>
                  <div class='mmgis-checkbox'><input type='checkbox' checked='' id='checkbox_msmsUIV2' value='toolbars' /><label for='checkbox_msmsUIV2' /></div>
                  <div>Toolbars</div>
                </li>
                <li>
                  <div class='mmgis-checkbox'><input type='checkbox' checked='' id='checkbox_msmsUIV3' value='scalebar' /><label for='checkbox_msmsUIV3' /></div>
                  <div>Scale Bar</div>
                </li>
                <li>
                  <div class='mmgis-checkbox'><input type='checkbox' checked='' id='checkbox_msmsUIV4' value='coordinates' /><label for='checkbox_msmsUIV4' /></div>
                  <div>Coordinates</div>
                </li>
                <li>
                  <div class='mmgis-checkbox'><input type='checkbox' id='checkbox_msmsUIV5' value='graticule' /><label for='checkbox_msmsUIV5' /></div>
                  <div>Graticule</div>
                </li>
                <li>
                  <div class='mmgis-checkbox'><input type='checkbox' checked='' id='checkbox_msmsUIV6' value='miscellaneous' /><label for='checkbox_msmsUIV6' /></div>
                  <div>Miscellaneous</div>
                </li>
              </ul>
            </div>
            <div class='mainSettingsModalSection' id='mainSettingsModalSection3DGlobe'><div class='mainSettingsModalSectionTitle'>3D Globe</div><ul class='mainSettingsModalSectionOptions'><li class='flexbetween'><div>Radius of Tiles<i
              title='Number of tiles to query out from the center in the Globe view.
  The higher the number, the more data queried in the distance (which may hurt performance).
  ' class='infoIcon mdi mdi-information mdi-12px' /></div><div class='flexbetween'><div id='globeRadiusOfTilesValue' style='padding: 0px 6px;'>5</div><input id='globeSetRadiusOfTiles' class='slider2' type='range' min='4' max='11' step='1' value='5' /></div></li></ul></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KeysModal ({ dismissModal }) {
  return (
    <div id='mmgisModal_0' class='mmgisModal dontCloseWhenClicked' style='opacity: 1;'>
      <div id='mmgisModalClose'><i class='mdi mdi-close mdi-24px' /></div>
      <div id='mmgisModalInner'>
        <div id='mainHotkeysModal'>
          <div id='mainHotkeysModalTitle'>
            <div><i class='mdi mdi-keyboard mdi-18px' /><div>Hotkeys</div></div>
            <div id='mainHotkeysModalClose' onClick={dismissModal}><i class='mmgisHoverBlue mdi mdi-close mdi-18px' /></div>
          </div>
          <div id='mainHotkeysModalContent'>

            <div class='mainHotkeysModalSection'>
              <div class='mainHotkeysModalSectionTitle'>Draw</div>
              <ul class='mainHotkeysModalSectionOptions'>
                <li class='mainHotkeysModalSectionSubtitle'>Toggle</li>
                <li>
                  <div>Last File</div>
                  <div>ALT + 1</div>
                </li>
                <li class='mainHotkeysModalSectionSubtitle'>Shapes Tab</li>
                <li>
                  <div>Next Feature</div>
                  <div>Arrow-Right</div>
                </li>
                <li>
                  <div>Previous Feature</div>
                  <div>Arrow-Left</div>
                </li>
                <li>
                  <div>Add to Group</div>
                  <div>CTRL + Click</div>
                </li>
                <li>
                  <div>Group Range Select</div>
                  <div>SHIFT + Click</div>
                </li>
              </ul>
            </div>
            <div class='mainHotkeysModalSection'>
              <div class='mainHotkeysModalSectionTitle'>Map</div>
              <ul class='mainHotkeysModalSectionOptions'>
                <li>
                  <div>Zoom out</div>
                  <div>-</div>
                </li>
                <li>
                  <div>Zoom In</div>
                  <div>+</div>
                </li>
                <li>
                  <div>Zoom to Area</div>
                  <div>SHIFT + Click-and-Drag</div>
                </li>
              </ul>
            </div>
            <div class='mainHotkeysModalSection'>
              <div class='mainHotkeysModalSectionTitle'>3D Globe</div>
              <ul class='mainHotkeysModalSectionOptions'>
                <li>
                  <div>Pan Up</div>
                  <div>Arrow-Up</div>
                </li>
                <li>
                  <div>Pan Right</div>
                  <div>Arrow-Right</div>
                </li>
                <li>
                  <div>Pan Down</div>
                  <div>Arrow-Down</div>
                </li>
                <li>
                  <div>Pan Left</div>
                  <div>Arrow-Left</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MissionPicker ({ setActiveMission }) {
  const config = globalThis.appConfig
  const [missions, setMissions] = useState([])
  useEffect(() => {
    fetch(`${config.baseURL}/api/configure/missions`, {
      referrerPolicy: 'no-referrer',
      body: null,
      method: 'GET',
      mode: 'cors'
    }).then(res => res.json())
      .then(res => {
        console.log('Missions available on server', res)
        setMissions(res.missions)
      })
  }, [])

  // TODO: See if we're missing any attributions
  const attributionElements = []
  for (const attribution of require('./attributions')) {
    attributionElements.push(
      <li key={attribution.library}>
        <div>
          <a class='attribution_library' href='https://codemirror.net/' target='_blank' rel='noreferrer'>{attribution.library}</a>
          <div class='attribution_version'>v{attribution.version}</div>
        </div>
        <div>
          <div class='attribution_by'>by</div>
          <a class='attribution_author' href='https://github.com/marijnh' target='_blank' rel='noreferrer'>{attribution.author}</a>
          <div class='attribution_under'>, under</div>
          <a class='attribution_license' href={attribution.licenselink} target='_blank' rel='noreferrer'>{attribution.license}</a>
          <a class='attribution_github mdi mdi-github-circle mdi-18px' href={attribution.githublink} target='_blank' rel='noreferrer' />
        </div>
      </li>
    )
  }

  return (
    <div class='landingPage' style='position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; opacity: 1;'><div class='gradient' /><div class='landingBottom'><div class='imagecredit'><div>Wind at Work</div><a target='__blank' rel='noreferrer' href='https://photojournal.jpl.nasa.gov/catalog/PIA20461' title='Splash Image Credit: NASA/JPL-Caltech/Univ. of Arizona'><i class='mdi mdi-information-outline mdi-14px' /></a></div><div class='version' style='cursor: pointer;'>v2.10.0</div></div><div style='position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);' /><div id='title' style='z-index: 200;'><p class='unselectable' style='font-size: 40px; opacity: 1; cursor: default; padding: 0px 10px;'><img src='/images/logos/mmgis.png' alt='Full logo' /></p></div><div id='landingPanel' /><div id='landingMissionsWrapper'>
      <ul style='margin: 0px; padding: 0px 20px 0px 0px; height: calc(100vh - 200px); overflow-y: auto;'>
        {
          missions.map((mission, ix) => <li key={ix} class='landingPageMission' onClick={() => setActiveMission(mission)}>{mission}</li>)
        }
      </ul></div><div id='attributionIcon' class='mdi mdi-dna mdi-24px' title='Attributions' /><div id='attributions'>
        <div id='attributionsContent'>
          <div id='attributionsTitle'>
            <div>
              <a class='attributionTitle_library' href='' target='_blank' rel='noreferrer'><img src='public/images/logos/mmgis.png' alt='Full logo' height='20px' /></a>
              <div class='attributionTitle_version'>v2.10.0</div>
            </div>
            <div>
              <div class='attributionTitle_by' />
              <a class='attributionTitle_author' href='' target='_blank' rel='noreferrer'>NASA/JPL-Caltech</a>
              <div class='attributionTitle_under'>, under</div>
              <a class='attributionTitle_license' href='https://www.apache.org/licenses/LICENSE-2.0' target='_blank' rel='noreferrer'>Apache-2.0</a>
              <a class='attributionTitle_github mdi mdi-github-circle mdi-36px' href='https://github.com/NASA-AMMOS/MMGIS' target='_blank' rel='noreferrer' />
            </div>
          </div>
          <ul>
            {attributionElements}
            <li>And to all the node packages within package.json and a special thanks to every contributor.</li></ul>
        </div>
      </div></div>
  )
}

function Mission ({ missionData }) {
  console.debug('got mission data', missionData)
  const [showSettings, setShowSettings] = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  return (
    <div id='main-container' style='opacity: 1; filter: blur(0px);'>
      <TopBar />
      <BottomBar showKeysModal={() => setShowKeys(true)} showSettingsModal={() => setShowSettings(true)} />
      <ToolContainer missionData={missionData} />
      <SplitScreens />
      {showSettings && <SettingsModal dismissModal={() => setShowSettings(false)} />}
      {showKeys && <KeysModal dismissModal={() => setShowKeys(false)} />}
      <div
        id='mmgislogo'
        style='display: inherit; padding: 9px 6px; cursor: pointer; width: 40px; height: 40px; position: absolute; top: 0px; left: 0px; z-index: 2005; image-rendering: pixelated;'
      >
        <svg width='27' height='27' viewBox='0 0 231 137' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M0.222266 9.21339C-0.277832 14.7126 0.222266 133.713 0.222266 133.713H26.2223V45.7134C26.2223 45.7134 100.722 127.712 106.222 132.713C109.171 135.395 112.12 136.782 115.222 136.645C118.325 136.782 121.274 135.395 124.222 132.713C129.722 127.712 204.222 45.7134 204.222 45.7134V133.713H230.222C230.222 133.713 230.722 14.7126 230.222 9.21339C229.722 3.71413 218.222 -3.28766 210.222 1.71339C202.222 6.71444 115.222 104.713 115.222 104.713C115.222 104.713 28.2224 6.71444 20.2223 1.71339C12.2222 -3.28766 0.722363 3.71413 0.222266 9.21339Z'
            fill='#08AEEA'
          />
        </svg>
      </div>
    </div>
  )
}

function Main () {
  const config = globalThis.appConfig
  console.log('Loading...')
  const [activeMissionData, setActiveMissionData] = useState(null)
  const [activeMission, setActiveMission] = useState(null)

  async function updateActiveMission (name) {
    const data = await fetch(`${config.baseURL}/api/configure/get?mission=${name}`, {}).then(res => res.json())
    setActiveMission(name)
    setActiveMissionData(data)
  }

  return (
    <Fragment>
      <link rel='stylesheet' href='components/main.css' />
      <link rel='stylesheet' href='components/mmgis.css' />
      <link rel='stylesheet' href='components/LayersTool.css' />
      <link rel='stylesheet' href='components/viewer.css' />
      <link rel='stylesheet' href='components/droppy.css' />
      <link rel='stylesheet' href='components/search.css' />
      <link rel='stylesheet' href='components/modal.css' />
      <link rel='stylesheet' href='components/InfoTool.css' />
      <link rel='stylesheet' href='components/toolbar.css' />
      <link rel='stylesheet' href='components/mmgisUI.css' />
      <link rel='stylesheet' href='components/LandingPage.css' />
      <link rel='stylesheet' href='css/materialdesignicons/materialdesignicons.css' />
      {!activeMission && <MissionPicker setActiveMission={updateActiveMission} />}
      {activeMissionData && <Mission missionData={activeMissionData} />}
    </Fragment>
  )
}

render(<Main />, document.body)
document.querySelector('.LoadingPage').style.display = 'none'
document.getElementById('main-container').remove()
