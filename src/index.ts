import { readFileSync } from "fs";
import { parse } from "yaml";
import { Stream } from "@elara-services/bluesky";
import axios from "axios";
import { makeEmbed } from "./formatting";

class Client {
	secrets: Secrets;
	config: ObjectAny;

	stream: Stream;

	postHistory: string[] = [];

	constructor() {
		this.secrets = parse(readFileSync("./configs/secrets.yaml", "utf-8"));

		this.stream = new Stream({
			keys: this.secrets.keys,
			searchMinutes: 0.2,
			debug: true,
			defaultService: "https://bsky.social",
		});

		for (const { handle } of this.secrets.feeds) {
			this.stream.manage.add({ handle });
		};

		this.stream.onPost(async (user, post, format) => {
			if (this.postHistory.includes(format.links.cid)) {
				return;
			}

			this.postHistory.push(format.links.cid);

			const feed = this.secrets.feeds.find(f => user.handle === f.handle);

			if (!feed) {
				return;
			}

			await axios.post(feed.webhook, {
				content: null,
				embeds: [makeEmbed(user, post, format, feed)],
			});
		});
	}

	start() {
		return this.stream.start();
	}

}

const client = new Client();
client.start();