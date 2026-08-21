import GtfsRealtimeBindings from "gtfs-realtime-bindings";

// fetch and decode GTFS RT feed
export const fetchFeed = async (url: string) => {
	const feed = await fetch(url).then(async (res) => {
		const buffer = await res.arrayBuffer();
		const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
			new Uint8Array(buffer),
		);

		return feed;
	});

	return feed;
};
