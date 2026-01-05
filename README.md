# Project 1356

1 year is too short. 5 years is too long. **1,356 days** is the perfect cutthroat deadline to change your life.

Project 1356 is a minimalist, offline-first Progressive Web App (PWA) designed to keep you focused on 6 non-negotiable goals.

<img width="1187" height="1272" alt="Screenshot at Jan 06 00-00-15" src="https://github.com/user-attachments/assets/f5d6b237-537d-460b-9599-93487ccb4a4d" />

## The Philosophy

> "Life is limited. Every single day matters."

This project is based on the philosophy that a visual countdown creates the necessary urgency to drive real character development.

**Inspiration & Credits:**
The core concept and philosophy for this app were inspired by this video:
[1356 Days to Change Your Life](https://www.youtube.com/watch?v=HHPuA8j8LzU)

## Features

- **Strict Mode**: Once you start, you cannot restart or edit goals until the timer runs out or you complete your mission.
- **Privacy First**: No accounts, no cloud, no tracking. All data is stored locally on your device (`localStorage`).
- **Offline Capable**: Fully functional PWA that works without an internet connection.
- **Installable**: Add it to your mobile home screen for a focused experience.

## Tech Stack

- **Core**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Pure CSS (Dark Mode optimized)
- **PWA**: manifest.json, Service Worker for offline caching

## How to Run

1. Clone the repository.
2. Serve the directory with any static file server:
   ```bash
   python3 -m http.server
   ```
3. Open `http://localhost:8000` in your browser.
