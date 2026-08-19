import { LngLatBounds } from "maplibre-gl";
import { Station } from "../types";

function padBounds(bounds: LngLatBounds, factor: number): LngLatBounds {
	const north = bounds.getNorth();
	const south = bounds.getSouth();
	const east = bounds.getEast();
	const west = bounds.getWest();

	const latPad = (north - south) * factor;
	const lngPad = (east - west) * factor;

	return new LngLatBounds(
		[west - lngPad, south - latPad], // southwest
		[east + lngPad, north + latPad], // northeast
	);
}

export const filterViewportStops = (
	stations: Station[],
	bounds: LngLatBounds,
): Station[] => {
	const padding = 0.5;
	const paddedBounds = padBounds(bounds, padding);

	return stations.filter((s) => paddedBounds.contains([s.lon, s.lat]));
};
