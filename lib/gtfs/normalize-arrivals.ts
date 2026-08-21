import { PlatformId } from "@/lib/types";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

// normalize feed into arrivals
export const toArrivals = (
	feed: GtfsRealtimeBindings.transit_realtime.FeedMessage,
	platformId: PlatformId,
) => {
	const arrivals = feed.entity.flatMap((ent) => {
		// filter entities without trip updates
		if (ent.tripUpdate) {
			const update = ent.tripUpdate.stopTimeUpdate?.find(
				(update) => update.stopId === platformId,
			);

			// if there is an update, normalize the arrival time.
			if (update) {
				const arrivesAt =
					Number(update.arrival?.time ?? update.departure?.time) * 1000;

				if (Number.isNaN(arrivesAt)) return [];
				// if arrival time is valid, return arrival
				else
					return [
						{
							routeId: ent.tripUpdate.trip.routeId,
							platformId,
							arrivesAt,
							tripId: ent.tripUpdate.trip.tripId,
						},
					];
			}
			return [];
		}
		return [];
	});

	// slice to first 3 arrivals
	const slicedArr = arrivals
		.sort((a, b) => a.arrivesAt - b.arrivesAt)
		.slice(0, 2);

	return slicedArr;
};
