# discord.js v13 Buttons Pagination

This package uses [discord.js](https://github.com/discordjs/discord.js) dev branch which has officially received support for buttons which meand It'll be supported by djs v13.


You can send max 5 buttons in a row and max 5 rows with 1 message but here we're going to implement only 2 buttons for navigating between multiple pages (array of message emebds)

You can pass you own `EmojiIdentifierResolvable` array (2 emojis) that will be added in each button.
1st emoji - Previous Button
2nd emoji - Next Button

---

### Installation

- `npm install djs-buttons-pagination`

--- 

### Usage

```js
// Import the  package djs-buttons-pagination
const buttonsPagination = require("djs-buttons-pagination");

// Make your embeds.
const { MessageEmbed } = require("discord.js");
const embed1 = new MessageEmbed();

// Create an array of embeds
const pages = [ embed1, embed2, /* soo on however embeds you want*/, embedx];

// Call the paginationEmbed method, first two arguments (message and pages) are required
// emojiList is the pageturners defaults to [] i.e no emojis
// timeout is the time till the reaction collectors are active, after this buttons will be disabled (in ms), defaults to 60000
buttonsPagination(message, pages, emojiList, timeout);
```

And there you have your latest djs v13 buttons pagination

---

### Preview

![Preview](https://github.com/DiabolusGX/djs-buttons-pagination/blob/master/demo/demo.png)


---


### Need Help?

- **Join my discord server: https://discord.gg/8kdx63YsDf**