import { PlatformId } from "@/lib/types";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const normalizeFeed = (platformId: PlatformId) => {
	fetch(
		"https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
	).then(async (res) => {
		const buffer = await res.arrayBuffer();
		const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
			new Uint8Array(buffer),
		);

		const arrivals = feed.entity.flatMap((ent) => {
			if (ent.tripUpdate) {
				const update = ent.tripUpdate.stopTimeUpdate?.find(
					(update) => update.stopId === platformId,
				);

				if (update) {
					const arrivesAt =
						Number(update.arrival?.time ?? update.departure?.time) * 1000;

					if (Number.isNaN(arrivesAt)) return [];
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

		const slicedArr = arrivals
			.sort((a, b) => a.arrivesAt - b.arrivesAt)
			.slice(0, 4);

		console.log(slicedArr);
	});
};

const testPlatformid = "A02N";

normalizeFeed(testPlatformid);
