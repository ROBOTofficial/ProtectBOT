const { Client, Intents, WebhookClient, ModalSubmitInteraction ,Options, Interaction, Guild, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_WEBHOOKS] });
const discordModals = require('discord-modals');
const { CONNECTING } = require('ws');
const prompt = require('prompt-sync')();
const fs = require("fs");
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
discordModals(client);


const token = '';

client.on("ready", async () => {
    const data = [
        {
            name: 'word',
            description: '禁止ワード一覧',
            options: [{
                type: 'STRING',
                name: 'type',
                description: 'サーバーかチャンネルか選択',
                required: true,
                choices: [
                    {name: 'channel', value:'チャンネル'},
                    {name: 'server', value:'サーバー'}
                ]
            }]
        },
        {
            name: 'add_word_channel',
            description:'チャンネルに禁止ワードを追加',
            options: [{
                type: "STRING",
                name: "word",
                description: "禁止ワードを記入",
                required: true,
            }],
        },
        {
            name: 'remove_word_channel',
            description:'チャンネルに禁止ワードを追加',
            options: [{
                type: "STRING",
                name: "word",
                description: "禁止ワードを記入",
                required: true,
            }],
        },
        {
            name: 'add_word_guild',
            description:'チャンネルに禁止ワードを追加',
            options: [{
                type: "STRING",
                name: "word",
                description: "禁止ワードを記入",
                required: true,
            }],
        },
        {
            name: 'remove_word_guild',
            description:'チャンネルに禁止ワードを追加',
            options: [{
                type: "STRING",
                name: "word",
                description: "禁止ワードを記入",
                required: true,
            }],
        },
        //依然作ったボットからの引用
        {
            name: "search_id",
            description: "search",
            options: [{
                type: "STRING",
                name: "id",
                description: "id",
                required: true,
            }],
        },
        {
            name: "search_user",
            description: "search",
            options: [{
                type: "USER",
                name: "user",
                description: "user",
                require: true,
            }],
        },
        {
            name: "id",
            description: "自分のidを表示",
        },
    ]
    client.user.setActivity("荒らし対策BOT", {type: 'PLAYING'});
    await client.application.commands.set(data);
    console.log('起動完了');
});

client.on('interactionCreate',async (Interaction) =>{
    const info = JSON.parse(fs.readFileSync('./info.json','utf-8'));
    if(Interaction.commanName === 'add_word_channel') {
        const word = Interaction.options.getstring('word');
        info[Interaction.guild.id][Interaction.channel.id]['word'][word] = true;
        fs.writeFileSync('./info.json',JSON.stringify(info));
    }
    if(Interaction.commanName === 'remove_word_channel') {
        const word = Interaction.options.getstring('word');
        delete info[Interaction.guild.id][Interaction.channel.id]['word'][word];
        fs.writeFileSync('./info.json',JSON.stringify(info));
    }
    if(Interaction.commanName === 'add_word_channel') {
        const word = Interaction.options.getstring('word');
        info[Interaction.guild.id]['word'][word] = true;
        fs.writeFileSync('./info.json',JSON.stringify(info));
    }
    if(Interaction.commanName === 'remove_word_guild') {
        const word = Interaction.options.getstring('word');
        delete info[Interaction.guild.id]['word'][word];
        fs.writeFileSync('./info.json',JSON.stringify(info));
    }
    if(Interaction.commanName === 'word') {
        await Interaction.reply('この機能は現在準備中です')
    }
    if (Interaction.commandName === 'id') {
        const id = Interaction.user.id;
        await Interaction.reply("あなたのidは" + id + "です");
    }
    if (Interaction.commandName === 'search_id') {
        const climinal = JSON.parse(fs.readFileSync('./climinal.json','utf-8'));
        const id = Interaction.options.getString("id");
        if (id === "944415513373724743") {
            await Interaction.reply(id + "はこのBOTの開発者です");
        } else if (typeof climinal[id] != 'undefined') {
            await Interaction.reply(`${id}は危険人物です`)
        }else {
            await Interaction.reply(id + "は安全です");
        }
    }
    if (Interaction.commandName === 'search_user') {
        const climinal = JSON.parse(fs.readFileSync('./climinal.json','utf-8'));
        const user1 = Interaction.options.getUser("user");
        if (user1 === null) {
            await Interaction.reply({content: "userを選択してください", ephemeral: true });
        } else if (user1.id === "944415513373724743") {
            await Interaction.reply("ID" + user1 + "はこのボットの開発者です");
        } else if (typeof climinal[user1.id] != 'undefined') {
            await Interaction.reply(`${user1.id}は危険人物です`)
        }else {
            await Interaction.reply("ID" + user1 + "は安全です");
        }
    }
});

client.on('messageCreate', async (message) => {
    const info = fs.readFileSync('./info.json','utf-8');
    const embed = new MessageEmbed()
    .setTitle('メッセージを削除しました')
    .setDescription('不具合があった場合は報告してください')
    .setColor('#00ced1')
    .addFields(
        {name: '送信者', value: `${message.author.id}`},
    )
    if(info[message.guild.id]['word'][message.content] == true) {
        embed
        .addFields(
            {name:'削除理由',value:'チャンネル禁止用語'}
        )
        await message.delete();
        await message.channel.send({embeds:[embed]});
    } else if (info[message.guild.id][message.channel.id]['word'][message.content] == true) {
        embed
        .addFields(
            {name:'削除理由',value:'サーバー禁止用語'}
        )
        await message.delete()
        await message.channel.send({embeds:[embed]});
    } else {
        return;
    }
});

client.login(token);