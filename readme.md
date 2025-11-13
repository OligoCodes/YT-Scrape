# 🎬 YouTube Scrape API (Express + Node.js)

![logo](https://github.com/OligoCodes/YT-Scrape/blob/main/assets/ei_1763053153967-removebg-preview.png)

A lightweight and developer-friendly **YouTube Data API alternative**, built using **youtubei.js** and **ytdl-core**.  

This API fetches live YouTube data — channels, videos, playlists, and search results — without relying entirely on Google’s official API.

It’s designed for **developers, creators, and students** who want to easily integrate YouTube data into their apps, dashboards, or AI tools.

---

## 🚀 Features

- ✅ Fetch channel details and uploaded videos  
- ✅ Retrieve video metadata, formats, and preview info  
- ✅ Fetch playlists and playlist videos  
- ✅ Perform YouTube searches  
- ✅ Supports both API and scraping fallback  
- ✅ Ready for deployment and monetization  

---

## 🧰 Tech Stack

| Technology   | Purpose |
|---------------|----------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework for routing |
| **youtubei.js** | Core YouTube data layer |
| **ytdl-core** | Video stream info and fallback |
| **dotenv** | Environment configuration |

---

## ⚙️ Installation

```bash
git clone https://github.com/OligoCodes/yt-scrape.git
cd yt-scrape
npm install
```

Create a `.env` file in the root directory:

```env
PORT=5000
YOUTUBE_API_KEY=your_google_api_key
```

Then start the server:

```bash
npm start
```

---

## 🌐 Base URL

```
http://localhost:5000/api
```

---

## 📡 API Endpoints

### 🎥 Channels

| Method | Endpoint | Description | Works |
|--------|-----------|--------------|--------|
| GET | `/channels?id=UC12345` | Get channel details | ✅ |
| GET | `/channels/:id/videos` | Get channel’s uploaded videos | ✅ |
| POST | `/channels/batch` | Fetch multiple channels by IDs | ✅ |

---

### 📺 Videos

| Method | Endpoint | Description | Works |
|--------|-----------|-------------|--------|
| GET | `/videos/:id` | Get video details | ✅ |
| GET | `/videos/:id/formats` | Get all available video formats | ✅ |
| GET | `/videos/:id/preview?seconds=10` | Get a short preview metadata | ✅ |
| GET | `/videos/:id/related` | Get related videos | ⚠️ Partial |
| GET | `/videos/:id/comments` | Fetch video comments | ❌ Not yet |
| POST | `/videos/batch` | Fetch multiple videos by IDs | ✅ |

---

### 🎞️ Playlists

| Method | Endpoint | Description | Works |
|--------|-----------|-------------|--------|
| GET | `/playlists/:id` | Get playlist details | ✅ |
| GET | `/playlists/:id/videos` | Get playlist videos | ✅ |

---

### 🔍 Search & Trending

| Method | Endpoint | Description | Works |
|--------|-----------|-------------|--------|
| GET | `/search?q=kwadwo+sheldon` | Search for videos or channels | ✅ |
| GET | `/trending?region=GH` | Get trending videos by region | ✅ |

---

## 🧪 Example Requests

### 1️⃣ Get Channel Details
```
GET http://localhost:5000/api/channels?id=UC_x5XG1OV2P6uZZ5FSM9Ttw
```

### 2️⃣ Get Video Info
```
GET http://localhost:5000/api/videos/dQw4w9WgXcQ
```

### 3️⃣ Search YouTube
```
GET http://localhost:5000/api/search?q=ghana+comedy
```

### 4️⃣ Get Playlist Videos
```
GET http://localhost:5000/api/playlists/PLlYKDqB0xXyNq1BEBx0F2fUlrH2Sg25xC/videos
```

---

## 🧩 Example Response

```json
{
  "success": true,
  "data": {
    "id": "dQw4w9WgXcQ",
    "title": "Never Gonna Give You Up",
    "author": "Rick Astley",
    "views": 123456789,
    "duration": "3:32"
  }
}
```

---

## 📈 Planned Additions

- Batch endpoints for videos and channels  
- Enhanced comment fetching and pagination  
- Thumbnails, captions, and subtitles  
- YouTube Shorts integration  
- Dashboard UI for API usage analytics  
- Monetization via usage credits and subscriptions  

---

## 💡 Monetization Ideas

- Build a **YouTube Analytics Dashboard** connected to this API  
- Offer **paid API keys** with usage limits  
- Sell **subscription plans** for high-volume users  
- Add **AI-powered recommendations** using this data

## NB: These ideas remain for Joseph Kwabena Osei Bonsu and partially for future contributors

---

## 🤝 Contributing

Contributions, bug fixes, and ideas are welcome!  
Open an issue or pull request — collaboration makes the API stronger.

---

## 📄 License

MIT License © 2025  
**Author:** Joseph Osei Bonsu 🇬🇭

---

## 👨🏽‍💻 Author

**Name:** Joseph Osei Bonsu  
**Email:** josephoseibonsu742@gmail.com  
**Bio:** Passionate about technology, APIs, and digital innovation.  


# 🎥 YouTube Data API - Endpoint Verification Dashboard

base_url: "http://localhost:5000/api"

# ──────────────────────────────
# ✅ CHANNEL ENDPOINTS
# ──────────────────────────────
- name: Get Channel Info
  method: GET
  url: /channels?id=UC-lHJZR3Gqxm24_Vd_AJ5Yw
  status: ✅ Works
  notes: Returns full channel details.

- name: Get Channel Videos
  method: GET
  url: /channels/UC-lHJZR3Gqxm24_Vd_AJ5Yw/videos
  status: ✅ Works
  notes: Lists all videos for a given channel.

- name: Get Channels (Batch)
  method: POST
  url: /channels/batch
  body:
    ids: ["UC-lHJZR3Gqxm24_Vd_AJ5Yw", "UCX6OQ3DkcsbYNE6H8uQQuVA"]
  status: ✅ Works
  notes: Fetch multiple channels in one request.

# ──────────────────────────────
# ✅ VIDEO ENDPOINTS
# ──────────────────────────────
- name: Get Video Info
  method: GET
  url: /videos/dQw4w9WgXcQ
  status: ✅ Works
  notes: Basic metadata, title, description, and stats.

- name: Get Video Formats
  method: GET
  url: /videos/dQw4w9WgXcQ/formats
  status: ✅ Works
  notes: Lists available resolutions and qualities.

- name: Get Related Videos
  method: GET
  url: /videos/dQw4w9WgXcQ/related
  status: ⚠️ Partial (Empty list)
  notes: Returns empty array — still functional but limited.

- name: Get Video Comments
  method: GET
  url: /videos/dQw4w9WgXcQ/comments
  status: ❌ Broken
  notes: Internal server error — needs refactor in controller/service.

- name: Get Video Preview
  method: GET
  url: /videos/dQw4w9WgXcQ/preview?seconds=10
  status: ✅ Works
  notes: Returns title, ID, and preview duration in seconds.

- name: Get Videos (Batch)
  method: POST
  url: /videos/batch
  body:
    ids: ["dQw4w9WgXcQ", "3JZ_D3ELwOQ"]
  status: ✅ Works
  notes: Fetch multiple video details at once.

# ──────────────────────────────
# ✅ PLAYLIST ENDPOINTS
# ──────────────────────────────
- name: Get Playlist Info
  method: GET
  url: /playlists/PL9tY0BWXOZFvxYyQh1FoXGZkO2P6Sw6gj
  status: ✅ Works
  notes: Fetch metadata for a playlist.

- name: Get Playlist Videos
  method: GET
  url: /playlists/PL9tY0BWXOZFvxYyQh1FoXGZkO2P6Sw6gj/videos
  status: ✅ Works
  notes: Lists videos in a playlist.

# ──────────────────────────────
# ✅ SEARCH & TRENDING
# ──────────────────────────────
- name: Search Videos
  method: GET
  url: /search?query=lofi%20music
  status: ✅ Works
  notes: Returns results based on search keywords.

- name: Get Trending Videos
  method: GET
  url: /trending
  status: ✅ Works
  notes: Fetches trending videos globally or regionally.
```
