import Discord, { Client, Message, IntentsBitField, Partials, ChannelType } from "discord.js";

export class AutoYeeter {
    private _client: Client;

    constructor(token: string, keywords: string[]) {
        const intents = new IntentsBitField();
        // All of this is probably not needed but i dont want to research it at the moment
        intents.add("Guilds", "GuildBans", "GuildMembers", "GuildMessages", "GuildModeration", "MessageContent");

        this._client = new Discord.Client({
            intents: intents,
            partials: [Partials.Message, Partials.Channel]
        });
        this._client.login(token);

        this._client.on('ready', () => {
            console.log(`Logged in as ${this._client!.user!.tag}!`);
        });

        this._client.on("disconnect", async function (event) {
            console.log(`The WebSocket has closed and will no longer attempt to reconnect`);
        });

        this._client.on("messageCreate", async (message: Message) => {
            try {
                if (message.author.bot) {
                    // Ignore bots
                    return;
                }

                if (message.channel.type != ChannelType.GuildText) {
                    // Ingore non text channels
                    return;
                }

                for (let i = 0; i < keywords.length; i++) {
                    const keyword = keywords[i].toLowerCase();
                    if (message.content.toLocaleLowerCase().includes(keyword)) {
                        console.log("Detected violation. Keyword: " + keyword + " Username: " + message.author.username + " Full message: " + message.content);
                        await message.delete();
                        await message.member?.ban({
                            reason: "You where automatically banned to keep the server safe. If you belive this was a mistake please email us at help@novauniverse.net"
                        });
                        break;
                    }
                }
            } catch (err) {
                console.error(err);
            }
        });
    }
}