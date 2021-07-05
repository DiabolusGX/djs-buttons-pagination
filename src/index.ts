import {
    Message,
    Collection,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    EmojiIdentifierResolvable,
    MessageComponentInteraction,
} from "discord.js";

const getButtons = (
    prev: boolean,
    nxt: boolean,
    prevEmoji?: EmojiIdentifierResolvable,
    nextEmoji?: EmojiIdentifierResolvable
): MessageActionRow =>
    new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomID("previouspage")
            .setLabel("Previous Page")
            .setStyle("DANGER")
            .setEmoji(prevEmoji ?? "")
            .setDisabled(prev),
        new MessageButton()
            .setCustomID("nextpage")
            .setLabel("Next Page")
            .setStyle("SUCCESS")
            .setEmoji(nextEmoji ?? "")
            .setDisabled(nxt)
    );

export const buttonsPagination = async (
    msg: Message,
    pages: MessageEmbed[],
    emojis: EmojiIdentifierResolvable[] = ["", ""],
    timeout = 120000
) => {
    if (!msg || !msg.channel) throw new Error("Channel is inaccessible.");
    if (!pages) throw new Error("Pages are not given.");
    if (!emojis.length) emojis = ["", ""]

    let page = 0;
    const navButtonsRow = getButtons(
        page === 0,
        page === pages.length - 1,
        emojis[0],
        emojis[1]
    );
    const curPage = await msg.channel.send({
        embeds: [pages[page]],
        components: [navButtonsRow],
    });

    const filter = (i: MessageComponentInteraction): boolean =>
        (i.customID === "nextpage" || i.customID === "previouspage") &&
        !i.user.bot &&
        i.user.id === msg.author.id;
    const collector = msg.channel.createMessageComponentInteractionCollector({
        filter,
        time: timeout,
    });

    collector.on("collect", async (i: MessageComponentInteraction) => {
        await i.deferUpdate();
        if (i.customID === "previouspage" && page > 0) page--;
        else if (i.customID === "nextpage" && page + 1 < pages.length) page++;
        curPage.edit({
            embeds: [pages[page]],
            components: [
                getButtons(
                    page === 0,
                    page === pages.length - 1,
                    emojis[0],
                    emojis[1]
                ),
            ],
        });
    });
    collector.on(
        "end",
        (
            _collected: Collection<`${bigint}`, MessageComponentInteraction>
        ): Awaited<void> => {
            curPage.edit({
                embeds: [pages[page]],
                components: [getButtons(true, true, emojis[0], emojis[1])],
            });
        }
    );
    return curPage;
};
