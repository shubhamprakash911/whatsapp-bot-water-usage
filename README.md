# WhatsApp Water Usage Bot

## Introduction

This project is a WhatsApp bot that collects water usage data from users and stores it in an Excel sheet.

## How to Run

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your Twilio API keys.
4. Run the server: `node index.js`.
5. Start Ngrok: `ngrok http 3000`.
6. Update the webhook URL in your Twilio account with the Ngrok URL.

## Technical Architecture

- Node.js for the server.
- Twilio for WhatsApp API.
- ExcelJS for Excel file management.
- SetInterval for sending scheduled messages.

## Video Demonstration

[Link to video]
