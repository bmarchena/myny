"use client";

import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Page() {
	return (
		<Map
			initialViewState={{
				longitude: -74.006,
				latitude: 40.7128,
				zoom: 12,
			}}
			style={{ width: 600, height: 400 }}
			mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
		/>
	);
}
