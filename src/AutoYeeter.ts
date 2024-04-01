import Discord, { Client, Message, IntentsBitField, Partials, ChannelType } from "discord.js";

export class AutoYeeter {
    private _client: Client;

    constructor(token: string, keywords: string[], comboRuleSets: string[][][], banMessage: string) {
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
            this._client!.user!.setActivity({
                name: "Banning spam bots"
            });
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

                const messageContent = message.content.toLocaleLowerCase();

                // Keyword detection
                for (let i = 0; i < keywords.length; i++) {
                    const keyword = keywords[i].toLowerCase();
                    if (keyword.trim().length == 0) {
                        continue;
                    }
                    if (messageContent.includes(keyword)) {
                        console.log("Detected violation. Keyword: " + keyword + " Username: " + message.author.username + " Full message: " + message.content);
                        await message.delete();
                        try {
                            await message.author.send(banMessage);
                        } catch (err) {
                            console.log("User has dm's closed. Could not send ban message");
                        }
                        await message.member?.ban({
                            reason: banMessage
                        });
                        return;
                    }
                }

                // Advanced rule detection
                for (let x = 0; x < comboRuleSets.length; x++) {
                    const rule = comboRuleSets[x];
                    if (rule.length == 0) {
                        // Prevent false bans
                        break;
                    }

                    // If this reaces 0 the user brok all rules in this set
                    let passedRulesCounter = rule.length;
                    for (let y = 0; y < rule.length; y++) {
                        let passed = true;
                        for (let z = 0; z < rule[y].length; z++) {
                            const keyword = rule[y][z].toLocaleLowerCase();
                            if (keyword.trim().length == 0) {
                                continue;
                            }
                            if (messageContent.includes(keyword)) {
                                passed = false;
                                break;
                            }
                        }
                        if (!passed) {
                            passedRulesCounter--;
                        }
                    }

                    if (passedRulesCounter == 0) {
                        console.log("Detected violation. Message broke advanced rule with index " + x + " Username: " + message.author.username + " Full message: " + message.content);
                        await message.delete();
                        try {
                            await message.author.send(banMessage);
                        } catch (err) {
                            console.log("User has dm's closed. Could not send ban message");
                        }
                        await message.member?.ban({
                            reason: banMessage
                        });
                        return;
                    }
                }
            } catch (err) {
                console.error(err);
            }
        });
    }
}