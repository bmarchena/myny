"use client";

import Map, {
	LngLatBounds,
	Marker,
	ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import stops from "../data/stops.json";
import { useState } from "react";
import { MapLibreEvent } from "maplibre-gl";
import { filterViewportStops } from "@/lib/stops";

export default function Page() {
	const [mapBounds, setMapBounds] = useState<LngLatBounds>();

	const handleInitLoad = (e: MapLibreEvent) => {
		const map = e.target;
		setMapBounds(map.getBounds());
	};

	const handleMoveEnd = (e: ViewStateChangeEvent) => {
		const map = e.target;
		setMapBounds(map.getBounds());
	};

	return (
		<Map
			initialViewState={{
				longitude: -74.006,
				latitude: 40.7128,
				zoom: 12,
			}}
			style={{ width: 600, height: 400 }}
			mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			onMoveEnd={handleMoveEnd}
			onLoad={handleInitLoad}
		>
			{mapBounds &&
				filterViewportStops(stops, mapBounds).map((s) => (
					// NOTE: Options like anchor, color, scale are only read on the first component mount.
					// To change appearance later, make sure to use CSS on the child element of marker.
					<Marker key={s.id} latitude={s.lat} longitude={s.lon} />
				))}
		</Map>
	);
}
