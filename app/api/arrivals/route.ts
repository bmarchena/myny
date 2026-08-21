// TODO: write tests for this guy.

import { fetchFeed } from "@/lib/gtfs/fetch";
import { toArrivals } from "@/lib/gtfs/normalize-arrivals";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL_SUBWAY =
	"https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs";

const SUBWAY_LINES = ["ace", "bdfm", "g", "jz", "nqrw", "l", "1234567", "sir"];

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;

		const platformId = searchParams.get("platform");
		const route = searchParams.get("route")?.toLowerCase();

		// check if params are present
		if (!(platformId && route))
			return NextResponse.json({ error: "Invalid params" }, { status: 400 });

		let subwayUrl = BASE_URL_SUBWAY;

		// if the line includes the route, set subwayUrl
		SUBWAY_LINES.forEach((line) => {
			if (line.includes(route)) {
				if (line === "1234567") return;
				subwayUrl += `-${line}`;
			}
		});

		// fetch feed and normalize arrivals
		const feed = await fetchFeed(subwayUrl);
		const arrivals = toArrivals(feed, platformId);

		return NextResponse.json({ arrivals });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
