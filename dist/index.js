"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yaml_1 = require("yaml");
const bluesky_1 = require("@elara-services/bluesky");
const axios_1 = __importDefault(require("axios"));
const formatting_1 = require("./formatting");
class Client {
    secrets;
    config;
    stream;
    postHistory = [];
    constructor() {
        this.secrets = (0, yaml_1.parse)((0, fs_1.readFileSync)("./configs/secrets.yaml", "utf-8"));
        this.stream = new bluesky_1.Stream({
            keys: this.secrets.keys,
            searchMinutes: 0.2,
            debug: true,
            defaultService: "https://bsky.social",
        });
        for (const { handle } of this.secrets.feeds) {
            this.stream.manage.add({ handle });
        }
        ;
        this.stream.onPost(async (user, post, format) => {
            if (this.postHistory.includes(format.links.cid)) {
                return;
            }
            this.postHistory.push(format.links.cid);
            const feed = this.secrets.feeds.find(f => user.handle === f.handle);
            if (!feed) {
                return;
            }
            await axios_1.default.post(feed.webhook, {
                content: null,
                embeds: [(0, formatting_1.makeEmbed)(user, post, format, feed)],
            });
        });
    }
    start() {
        return this.stream.start();
    }
}
const client = new Client();
client.start();
