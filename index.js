import pkg from 'whatsapp-web.js';
import qrcode from "qrcode-terminal";
import fetch from "node-fetch";

// Hugging Face API.
const { Client, LocalAuth } = pkg;
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

// ⏰ Aktivzeiten
const ACTIVE_WINDOWS = [
    { start: 6, end: 9 },   // 06:00 - 09:00
    { start: 13, end: 20 }  // 13:00 - 20:00
];

// check ob jetzt aktiv
function isBotActive() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const current = hour * 60 + minute;

    return ACTIVE_WINDOWS.some(w => {
        const start = w.start * 60;
        const end = w.end * 60;
        return current >= start && current < end;
    });
}

// Hugging Face Anfrage
async function askHF(prompt) {
    try {
        const res = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });
        const data = await res.json();
        return data[0]?.generated_text || "Fehler bei HuggingFace 😢";
    } catch (e) {
        return "⚠️ API Fehler";
    }
}

// Client initialisieren mit Session-Speicherung
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: ".session"
    })
});

client.on("qr", qr => qrcode.generate(qr, { small: false }));
client.on("ready", () => console.log("✅ Bot ist online!"));

// Nachrichten Empfangen
client.on("message", async msg => {
    if (msg.from.endsWith("@g.us") && msg.body.toLowerCase().includes("@bot")) {
        if (isBotActive()) {
            const reply = await askHF(msg.body);

            // ⏳ zufällige Verzögerung (2–8 Sekunden)
            const delay = Math.floor(Math.random() * 6000) + 2000;
            setTimeout(() => {
                msg.reply(reply);
            }, delay);
        } else {
            // ❌ Außerhalb der Zeit → Bot schweigt
            console.log("⏰ Bot inaktiv, WA Business antwortet");
        }
    }
});

client.initialize();
