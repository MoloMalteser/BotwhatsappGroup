# WhatsApp KI-Bot

Dieser Bot:
- läuft auf WhatsApp (über `whatsapp-web.js`)
- nutzt HuggingFace AI (z. B. Mistral-7B)
- reagiert **nur auf `@bot`**
- ist **nur zu festen Zeiten aktiv** (06–09 Uhr, 13–20 Uhr)
- speichert seine Session (kein ständiges QR-Scannen nötig)

---

## Installation lokal
```bash
npm install
```

.env Datei anlegen:
```
HF_TOKEN=dein_huggingface_token
```

Start:
```bash
npm start
```

---

## Deployment auf Render
1. Repo zu GitHub pushen.
2. Auf [render.com](https://render.com) → **New Web Service** → dein Repo auswählen.
3. Runtime: Node.js
4. Build Command:  
   ```bash
   npm install
   ```
5. Start Command:  
   ```bash
   npm start
   ```
6. Environment Variable setzen:
   - `HF_TOKEN=dein_huggingface_token`
7. Deploy → im Log erscheint QR → einmal mit WhatsApp Business App scannen.
8. Fertig 🎉
