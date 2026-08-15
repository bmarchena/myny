export type StationId = string;
export type PlatformId = string;
export type RouteId = string;
export type Direction = "N" | "S";

export interface Station {
	id: StationId;
	name: string;
	lat: number;
	lon: number;
	routes: RouteId[];
}

export interface Arrival {
	routeId: RouteId;
	platformId: PlatformId;
	direction: Direction;
}
