import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const inspectFeed = () => {
	fetch(
		"https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
	).then(async (res) => {
		const buffer = await res.arrayBuffer();
		const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
			new Uint8Array(buffer),
		);
		const time = new Date(
			Number(
				feed.entity.at(0)?.tripUpdate?.stopTimeUpdate?.at(0)?.arrival?.time,
			) * 1000,
		);
		// console.log("time", time);
		console.dir(
			feed.entity.filter((ent) => ent.tripUpdate),
			{ depth: null },
		);
	});
};

inspectFeed();
