import { Message, MessageEmbed, MessageActionRow, MessageButton, Emoji } from "discord.js";

/**
 * @param  {Boolean} prev If you want PREVIOUS button disabled
 * @param  {Boolean} nxt If you want NEXT button disabled
 * @param  {Emoji} prevEmoji Emoji for previous button
 * @param  {Emoji} nextEmoji Emoji for next button
 */
const getButtons = (prev, nxt, prevEmoji, nextEmoji) => new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomID("previouspage")
            .setLabel("Previous Page")
            .setStyle("DANGER")
            .setEmoji(prevEmoji)
            .setDisabled(prev),
        new MessageButton()
            .setCustomID("nextpage")
            .setLabel("Next Page")
            .setStyle("SUCCESS")
            .setEmoji(nextEmoji)
            .setDisabled(nxt),
    );
/**
 * @param  {Message} msg Original message referene.
 * @param  {MessageEmbed[]} pages Array of MessageEmbeds.
 * @param  {Emoji[]} [emojis] Array of emojis to be added in buttons (pass [] or null if don't want emojis)
 * @param  {Number} [timeout] Time till buttons will be active in ms, default = 60000 ms.
 */
export default buttonsPagination = async (msg, pages, emojis = [], timeout = 60000) => {
    if (!msg && !msg.channel) throw new Error("Channel is inaccessible.");
    if (!pages) throw new Error("Pages are not given.");

    let page = 0;
    const navButtonsRow = getButtons(page === 0, page === pages.length - 1);
    const curPage = await msg.channel.send({ embeds: [pages[page]], components: [navButtonsRow] });

    const filter = i => (i.customID === "nextpage" || i.customID === "previouspage")
        && !i.user.bot && i.user.id === msg.author.id;
    const collector = msg.channel.createMessageComponentInteractionCollector({ filter, time: timeout });

    collector.on("collect", async i => {
        await i.deferUpdate();
        if (i.customID === "previouspage" && page > 0) page--;
        else if (i.customID === "nextpage" && page + 1 < pages.length) page++;
        curPage.edit({ embeds: [pages[page]], components: [getButtons(page === 0, page === pages.length - 1)] });
    });
    collector.on("end", collected => {
        curPage.edit({ embeds: [pages[page]], components: [getButtons(true, true)] });
        return curPage;
    });
}