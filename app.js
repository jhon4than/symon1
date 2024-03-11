const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const moment = require("moment");

const GROUP_IDS = [
    "120363168141937103@g.us",
    "120363069852572449@g.us",
    "120363117902938480@g.us",
    "120363198201376109@g.us",
    "120363167997450688@g.us",
    "120363242331328544@g.us",
];

const groupLinks = {
    "120363168141937103@g.us": [
        { label: "🎮SITE", url: "https://sshortly1.com/x6VaNf\n\n" },
        { label: "🛩", url: " 🛩💸🔑💥💥💥📲" }
    ],
    "120363069852572449@g.us": [
        { label: "🎮SITE", url: "https://sshortly1.com/x6VaNf\n\n" },
        { label: "🛩", url: " 🛩💸🔑💥💥💥📲" }
    ],
    "120363117902938480@g.us": [
        { label: "🎮SITE", url: "https://sshortly1.com/x6VaNf\n\n" },
        { label: "🛩", url: " 🛩💸🔑💥💥💥📲" }
    ],
    "120363198201376109@g.us": [
        { label: "🎮SITE", url: "https://sshortly1.com/x6VaNf\n\n" },
        { label: "🛩", url: " 🛩💸🔑💥💥💥📲" }
    ],
    "120363242331328544@g.us": [
        { label: "🎮SITE", url: "https://sshortly1.com/x6VaNf\n\n" },
        { label: "🛩", url: " 🛩💸🔑💥💥💥📲" }
    ],
    "120363167997450688@g.us": [
        { label: "🎮SITE", url: "https://sshortly1.com/9Zl0ad\n\n" },
        { label: "🛩", url: " 🛩💸🔑💥💥💥📲" }
    ]
};

const SIGNAL_INTERVAL_MINUTES_ONE = 2;
const SIGNAL_INTERVAL_MINUTES = 20;

const games = [{ name: "✈ AVIATOR ✈", image: "./aviator.jpg" }];

let currentGameIndex = 0;
let analysisSent = {};

const groupOptions = {
    "120363168141937103@g.us": {
        multiplier: "10x 40x",
        protection: "2.00X"
    },
    "120363069852572449@g.us": {
        multiplier: "10x 40x",
        protection: "2.00X"
    },
    "120363117902938480@g.us": {
        multiplier: "5x 10x",
        protection: "2.00X"
    },
    "120363198201376109@g.us": {
        multiplier: "10x 40🏅",
        protection: "2.00X"
    },
    "120363242331328544@g.us": {
        multiplier: "10x 40x",
        protection: "2.00X"
    },
    "120363167997450688@g.us": {
        multiplier: "*5x 40x*✈",
        protection: "2.00X"
    }
};

const client = new Client({
    authStrategy: new LocalAuth(),
});

function startSendingSignals() {
    GROUP_IDS.forEach(chatId => {
        if (!analysisSent[chatId]) {
            sendAnalysisMessage(chatId);
            analysisSent[chatId] = true;
        }
    });
}

function sendAnalysisMessage(chatId) {
    client.sendMessage(
        chatId,
        "👑 ATENÇÃO... IDENTIFICANDO PADRÕES🔎❗\n📊 ANALISANDO ALGORITMO...\n"
    ).then(() => {
        setTimeout(() => sendGameSignal(chatId), 1000 * 60 * SIGNAL_INTERVAL_MINUTES_ONE);
    });
}

function sendGameSignal(chatId) {
    const game = games[currentGameIndex];
    const gameImage = MessageMedia.fromFilePath(game.image);
    
    const links = groupLinks[chatId];

    if (!links) {
        console.error(`Não há links definidos para o grupo com o ID ${chatId}`);
        return;
    }

    const options = groupOptions[chatId];

    const randomMinutes = Math.floor(Math.random() * 6) + 3;
    const signalTime = moment().add(randomMinutes, 'minutes');

    let message = `☄✈𝗢𝗣𝗢𝗥𝗧𝗨𝗡𝗜𝗗𝗔𝗗𝗘\n\n𝙅𝙊𝙂𝙊: ${game["name"]}✈\nENTRADA 𝗗𝗔 𝗩𝗘𝗟𝗔: ${signalTime.format('HH:mm')}⏰\n\n🎯 𝗘𝗡𝗧𝗥𝗘 𝗡𝗢 𝗛𝗢𝗥𝗔𝗥𝗜𝗢 𝗘 𝗦𝗔𝗜𝗔\n\nPROTEÇÃO: ${options.protection}\n\n${options.multiplier}✈\nAté 3 tentativas🫵🏼\n\n`;

    links.forEach(link => {
        message += `${link.label} 📲: ${link.url}`;
    });

    client.sendMessage(chatId, gameImage, { caption: message }).then(() => {
        const greenSignalTime = signalTime.add(3, 'minutes');

        setTimeout(() => sendGreenSignal(chatId), greenSignalTime.diff(moment()));

        setTimeout(() => sendGameSignal(chatId), 1000 * 60 * SIGNAL_INTERVAL_MINUTES);
    });
}

function sendGreenSignal(chatId) {
    client.sendMessage(chatId, "GREEN ✅🚀").then(() => {
        console.log("Mensagem GREEN enviada com sucesso!");
    });
}

client.on("ready", () => {
    console.log("Bot Online!");
    startSendingSignals();
});

client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");
    client.getChats().then(chats => {
        const groups = chats.filter(chat => chat.isGroup);
        groups.forEach(group => {
            console.log(`Group Name: ${group.name}, Group ID: ${group.id._serialized}`);
        });
    });
});

client.initialize();
