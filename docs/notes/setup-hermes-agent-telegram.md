---
title: "Your Own Personal Secretary on Telegram: Setting Up Hermes Agent on a $2 VPS"
description: "A step-by-step guide to installing Hermes Agent on a cheap VPS, connecting it to Telegram, then having it log receipts into Excel and sign PDFs for you."
date: 2026-11-04
---

# Your Own Personal Secretary on Telegram: Setting Up Hermes Agent on a $2 VPS

Imagine having a personal secretary on standby 24/7 — you just message them on Telegram. Send a photo of a stack of receipts, and they log it into Excel. Send a contract PDF, and they add your signature. The salary? Roughly **$2 a month for a VPS, plus a few dollars for the API**.

That secretary is called **Hermes Agent**. In this post I'll walk you through setting it up from scratch, until it can actually get real work done for you.

> **Coming from my reels?** This is the full tutorial. Relax — every step is copy-paste friendly.

---

## What is Hermes Agent?

[Hermes Agent](https://github.com/NousResearch/hermes-agent) is an **open-source (MIT-licensed)** AI agent built by Nous Research. Here's how it's different from an ordinary chatbot:

- **It can act, not just talk.** It can run commands, write and execute scripts, and read and create files.
- **It lives in your chat app.** A single *gateway* process connects Hermes to Telegram, WhatsApp, Discord, Slack, Signal, and more.
- **It gets to know you over time.** Hermes stores memories and "skills" from experience, so the tasks you ask for often get done faster.
- **You pick its AI brain.** DeepSeek, Gemini, Ollama Cloud, OpenRouter, and many more. Switch anytime with `hermes model`.

## What you'll need

| Requirement | Options | Estimated cost |
|---|---|---|
| A server that stays on 24/7 | A cheap VPS (e.g. Sumopod), or an always-on PC/laptop | from ~$2/month |
| An AI "brain" | A **DeepSeek**, **Google Gemini**, or **Ollama Cloud** API key | top up ~$5, enough for light personal use for a month |
| A chat app | A Telegram account | free |

> 💡 **Tip on picking a model:** to read **photos of receipts**, use a model that can see images (*vision*), such as **Gemini Flash**. DeepSeek is very cheap for text, but check first whether the model you pick supports images.

> ⚠️ VPS and API prices change over time. Check each provider's official pricing page before topping up.

---

## Step 1 — Prepare the VPS

Pick a VPS running **Ubuntu 22.04/24.04**. For the cheapest tier (around 1 GB RAM), add *swap* so the install process doesn't run out of memory.

Log into the VPS over SSH:

```bash
ssh root@YOUR_VPS_IP
```

Create a regular user (don't run the agent as root):

```bash
adduser hermes
usermod -aG sudo hermes
su - hermes
```

Add 2 GB of swap (only for low-RAM VPSes):

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Step 2 — Install Hermes

Just one line from the official docs:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

> 🔍 Good habit: before running a script from the internet, open it in your browser first (`https://hermes-agent.nousresearch.com/install.sh`) so you know what's being installed.

The installer sets up Python, Node.js, FFmpeg, and other dependencies. Once it's done, reload your shell:

```bash
source ~/.bashrc
```

Check that everything is healthy:

```bash
hermes doctor
```

## Step 3 — Install its AI "brain"

Run:

```bash
hermes model
```

Then pick the provider matching the API key you have:

- **Google Gemini** → get an API key at [Google AI Studio](https://aistudio.google.com/apikey), then choose the `gemini` provider.
- **DeepSeek** → get an API key at [platform.deepseek.com](https://platform.deepseek.com), then choose the `deepseek` provider.
- **Ollama Cloud** → choose "Ollama Cloud", paste your `OLLAMA_API_KEY`, then pick a model from the list.

The wizard saves your key in `~/.hermes/.env`. **Never share this file** with anyone.

Try a quick chat in the terminal first:

```bash
hermes
```

Type "hi, who are you?" If it replies, the brain is wired up. Exit with `Ctrl+C`.

## Step 4 — Create a Telegram bot

1. Open Telegram and search for **@BotFather** (the official one, with the blue check).
2. Send `/newbot`.
3. Enter a display name, e.g. `MySecretary`.
4. Enter a unique username ending in `bot`, e.g. `my_secretary_jan_bot`.
5. BotFather gives you a **token** like `123456789:ABCdef...`. **Keep it safe and secret.** Anyone who holds this token can control your bot.

Next, find your Telegram **user ID** (the number, not the username): message **@userinfobot**, and it replies instantly with your ID.

## Step 5 — Connect Hermes to Telegram

```bash
hermes gateway setup
```

Choose **Telegram**, paste the bot token, then enter your user ID as the *allowed user*.

> 🔒 **This matters:** with `TELEGRAM_ALLOWED_USERS` set, only you can command Hermes. Without it, anyone who finds your bot could order around an agent that has access to your server.

So that Hermes keeps running even after you close SSH or the VPS restarts, install it as a service:

```bash
hermes gateway install
hermes gateway start
```

Now open your bot in Telegram and send "hi". 🎉 Your secretary is officially on the job.

---

## Demo 1 — Receipt photos, straight into Excel

Send 3–5 receipt photos to your bot, then write:

```text
These are this month's shopping receipts. Please log them all into an Excel
file with the columns: Date, Store Name, Total. Sort by date, add a TOTAL
row at the bottom, then send the .xlsx file back here.
```

Behind the scenes: Hermes reads the photo contents with a *vision* model, writes a small Python script to build the Excel file, runs it on the VPS, then sends the file back to the chat.

**Tips for accurate results:**
- Photograph receipts with good lighting and a straight angle.
- Ask it to **show the table in the chat first** before creating the file, so you can correct any misread numbers.
- If you do this often, say: *"Save this as a habit for future receipts."* Hermes can turn it into a skill.

## Demo 2 — Sign a PDF with your own signature

**One-time setup:** sign on a sheet of white paper, photograph or scan it, then send it to the bot:

```text
Here's a scan of my signature. Please remove the background so it's transparent
and save it as signature.png in the ~/personal-docs folder.
Never send this file to anyone but me.
```

**Whenever you need a signature:** send the PDF, then write:

```text
Sign this PDF with signature.png, placed above the "Second Party" label
on the last page. Send the result back.
```

Hermes uses a PDF library (such as `pypdf`/`pymupdf`) to stamp your signature image in that spot, then sends back `contract-signed.pdf`.

> ⚠️ **On signature security:** your signature file lives on the server. Make sure your VPS is secure (strong password or SSH key, a non-root user, `TELEGRAM_ALLOWED_USERS` set). For very important or formal legal documents, consider a certified e-signature.

---

## Cost breakdown

| Component | Cost per month |
|---|---|
| Cheap VPS | ~$2 |
| API (DeepSeek / Gemini / Ollama Cloud) | ~$5 for light use; Gemini and Ollama Cloud also have free quotas |
| Telegram + Hermes | Free |

Compare that to a premium chatbot subscription that can run tens of dollars a month — and still may not drop a finished Excel file onto your phone.

## Troubleshooting

| Symptom | Try this |
|---|---|
| Bot doesn't reply | `hermes gateway status` and `hermes gateway logs`; make sure your user ID is in the allowed users |
| Install fails / process dies on its own | Check RAM with `free -h`, make sure swap is active |
| API key / quota error | Run `hermes model` again, check your balance or quota in the provider dashboard |
| Anything else | `hermes doctor` |

## Bonus: got a powerful PC at home?

Hermes can also use a **local Ollama** on your own PC (via a *Custom Endpoint* at `http://localhost:11434/v1`), so there's no API cost at all. The catch: the PC needs to be powerful (lots of RAM/GPU) and always on.

---

## Wrapping up

For the price of two cups of coffee a month, you get an assistant that:
- is on standby 24/7 on Telegram,
- handles boring tasks like retyping receipts and signing documents,
- and keeps getting smarter at adapting to the way you work.

Given it a try? Tell me in the comments what you had Hermes do. It might just become the next content idea. 😄

*References: [Hermes Agent on GitHub](https://github.com/NousResearch/hermes-agent) · [Official docs](https://hermes-agent.nousresearch.com/docs/) · [Telegram guide](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram) · [Provider list](https://hermes-agent.nousresearch.com/docs/integrations/providers)*
