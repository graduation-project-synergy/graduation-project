import React, { useEffect, useRef, useState, useMemo } from "react";
import { Map as OlMap, View} from "ol";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat, get as getProjection } from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer, } from "ol/layer";
import {OSM, TileWMS, Vector as VectorSource } from "ol/source";
import "ol/ol.css";

import rgbPlaticon from "./images/rgbPlaticon.png";
import makeCrsFilter4node from "./utils/filter-for-node.js";
import makeCrsFilter from "./utils/crs-filter.js";

import Circle from 'ol/geom/Circle.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';


const Map = ({ pathData, width, height}) => {
    const mapContent = useRef(null); 
    const [isLayerVisible, setLayerVisible] = useState(true);

    const image = new CircleStyle({
        radius: 5,
        fill: null,
        stroke: new Stroke({color: 'red', width: 1}),
    });
    
    const styles = {
        'Point': new Style({
          image: image,
        }),
        'LineString': new Style({
          stroke: new Stroke({
            color: 'green',
            width: 1,
          }),
        }),
        'MultiLineString': new Style({
          stroke: new Stroke({
            color: 'green',
            width: 1,
          }),
        }),
        'MultiPoint': new Style({
          image: image,
        }),
        'MultiPolygon': new Style({
          stroke: new Stroke({
            color: 'yellow',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)',
          }),
        }),
        'Polygon': new Style({
          stroke: new Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3,
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)',
          }),
        }),
        'GeometryCollection': new Style({
          stroke: new Stroke({
            color: 'magenta',
            width: 2,
          }),
          fill: new Fill({
            color: 'magenta',
          }),
          image: new CircleStyle({
            radius: 10,
            fill: null,
            stroke: new Stroke({
              color: 'magenta',
            }),
          }),
        }),
        'Circle': new Style({
          stroke: new Stroke({
            color: 'red',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(255,0,0,0.2)',
          }),
        }),
      };
      
    const styleFunction = function (feature) {
        return styles[feature.getGeometry().getType()];
      };
    

    // Using useMemo to ensure that initVectorLayer is created only once
    const initVectorLayer = useMemo(() => new VectorLayer({ source: new VectorSource() }), []);

    const toggleLayerVisibility = () => {
        setLayerVisible(!isLayerVisible);
    };

    useEffect(() => {
        if (!mapContent.current) {
            return;
        }
        const osmLayer = new TileLayer({
            source: new OSM(),
            logo: false
        });
        const UOSorthoTile = new TileLayer({
            title: 'UOS Road',
            visible: isLayerVisible,
            source: new TileWMS({
                url: 'http://localhost:8080/geoserver/gp/wms',
                params: { 'LAYERS': 'gp:uos_orthomosaic' },
                serverType: 'geoserver',
            }),
        });
        const UOSbasemapTile = new TileLayer({
            title: 'UOS Base Map',
            visible: !isLayerVisible,
            source: new TileWMS({
                url: 'http://localhost:8080/geoserver/gp/wms',
                params: { 'LAYERS': 'gp:basemap' },
                serverType: 'geoserver',
            }),
        });
        const vectorSource = new VectorSource({
            Feature: new GeoJSON().readFeatures(BuildingJson),
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: styleFunction,
        });

        const map = new OlMap({
            controls: defaultControls({ zoom: false, rotate: false }).extend([]),
            layers: [
                osmLayer,
                initVectorLayer,
                UOSorthoTile,
                vectorLayer,
                UOSbasemapTile,
            ],
            view: new View({
                projection: getProjection("EPSG:5181"),
                center: fromLonLat([127.0596, 37.5837]),
                zoom: 17,
                minZoom: 16,
                maxZoom: 22,
            }),
            target: mapContent.current,
        });

        var locaArray = []; // 출발, 경유지, 도착지의 link_id를 담는 배열
        if (pathData && pathData.length >= 1) {
            pathData.forEach((path, index) => {
                const listOfEdgeId = path.map(e => e.edge);
                const listOfNodeId = path.map(n => n.node);
                locaArray.push(listOfNodeId[0]);
                const crsFilter = makeCrsFilter(listOfEdgeId);
                if (index === pathData.length - 1) {
                    locaArray.push(listOfNodeId[listOfNodeId.length - 2]);
                }
                const layer = new TileLayer({
                    title: `UOS Shortest Path ${index + 1}`,
                    source: new TileWMS({
                        url: 'http://localhost:8080/geoserver/gp/wms',
                        params: { 'LAYERS': 'gp:link', ...crsFilter },
                        serverType: 'geoserver',
                        visible: true,
                    }),
                });
                map.addLayer(layer);
            });
            console.log(locaArray);
        }
        if (locaArray && locaArray.length >= 2) {
            locaArray.forEach((path, index) => {
                const crsFilter = makeCrsFilter4node(locaArray);
                const layer = new TileLayer({
                    title: `Marker ${index + 1}`,
                    source: new TileWMS({
                        url: 'http://localhost:8080/geoserver/gp/wms',
                        params: { 'LAYERS': 'gp:node', ...crsFilter },
                        serverType: 'geoserver',
                        visible: true,
                    }),
                });
                map.addLayer(layer);
            });
        }

        return () => map.setTarget(undefined);
    }, [isLayerVisible, initVectorLayer, pathData]);


    return (
        <div className="gis-map-wrap" style={{position:'relative'}}>
            <button style={{position: 'absolute', top: '4px', right: '4px', 'zIndex': '100'}} onClick={toggleLayerVisibility}>
                <img src={rgbPlaticon} alt="드론 on/off 버튼" style={{ width: '40px', display: 'block', margin: '0 auto' }} />
            </button>
            <div ref={mapContent} style={{ width, height }}></div>
        </div>
    );
};

export default Map;