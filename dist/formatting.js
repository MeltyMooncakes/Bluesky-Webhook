"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEmbed = makeEmbed;
const builders_1 = require("@discordjs/builders");
function getImage(post, format) {
    let images = [];
    if (format.images.length > 0) {
        images.push(format.images[0]);
    }
    // @ts-ignore
    if (format.media.images.length > 0) { // @ts-ignore
        images.push(format.media.images[0].fullsize);
    }
    // @ts-ignore	
    if (post.embed && post.embed.media.images.length > 0) { // @ts-ignore
        images.push(post.embed.media.images[0].fullsize);
    }
    return images[0];
}
function formatText(text) {
    if (text.length === 0) {
        return null;
    }
    return text
        .replace(/\S+\.(\S+)\/\S+/g, (s) => `https://${s}`)
        .replace(/@[a-z1-9-_]+\.[a-z1-9-_]+(\.[a-z1-9-_]+)?/gi, s => `[${s}](https://bsky.app/profile/${s.replace("@", "")})`);
}
function makeEmbed(_user, post, format, feed) {
    let text = format.text;
    if (post.reply) { // @ts-ignore
        text += `\n\n-# Replying to **${post.reply.parent.author.handle}**\n> ${post.reply.parent.record.text}`;
    }
    const embed = new builders_1.EmbedBuilder()
        .setAuthor({
        iconURL: format.author.avatar,
        name: `${format.author.handle}${format.type === "repost" ? ` 🔁 Reposted by ${format.reposted?.user.handle}` : ""}`
    })
        .setColor(feed.colour)
        .setDescription(formatText(text))
        .setTimestamp(new Date(format.createdAt));
    embed.setImage(getImage(post, format));
    return embed;
}
