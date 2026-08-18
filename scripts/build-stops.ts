import { promises as fs } from "fs";
import { parse } from "csv-parse/sync";
import { Station } from "@/lib/types";

interface Stop {
	stop_id: string;
	stop_name: string;
	stop_lat: string;
	stop_lon: string;
	location_type: string;
	parent_station: string;
}

async function buildStops() {
	const readPath = new URL("../data/raw/stops.txt", import.meta.url);
	const content = await fs.readFile(readPath, "utf8");
	const records = parse(content, {
		bom: true,
		columns: true,
		on_record: (stop: Stop): Station | undefined => {
			if (stop.location_type === "1") {
				const coercedLon = Number(stop.stop_lon);
				const coercedLat = Number(stop.stop_lat);

				try {
					if (Number.isNaN(coercedLat) || Number.isNaN(coercedLon))
						throw new Error(`Invalid coordinates for Stop ID:${stop.stop_id}`);

					if (coercedLat < 40.47 || coercedLat > 40.93)
						throw new Error(`Invalid latitude for Stop ID:${stop.stop_id}`);

					if (coercedLon > -73.68 || coercedLon < -74.3)
						throw new Error(`Invalid longitude for Stop ID:${stop.stop_id}`);
				} catch (err) {
					console.log(err);
					return;
				}

				return {
					id: stop.stop_id,
					name: stop.stop_name,
					lon: coercedLon,
					lat: coercedLat,
					routes: [],
				};
			}

			console.log(records.length);
			return;
		},
	});
	try {
		const writePath = new URL("../data/stops.json", import.meta.url);
		await fs.writeFile(writePath, JSON.stringify(records, null, 2), "utf8");
		console.log("File written successfully.");
	} catch (error) {
		console.error(error);
	}
	return records;
}

buildStops();
