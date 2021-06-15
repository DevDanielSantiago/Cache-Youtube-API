require("dotenv/config");
const express = require("express");
const youtube = require("./lib/youtube");

const app = express();

app.get("/youtube/playlists", async (req, res) => {
  const params = req.query;
  
  const result = await youtube.playlists(params);

  return res.json(result);
});

app.get("/youtube/playlistItems", async (req, res) => {
  const params = req.query;
  
  const result = await youtube.playlistItems(params);

  return res.json(result);
});

app.get("/youtube/videos", async (req, res) => {
  const params = req.query;

  const result = await youtube.videos(params);

  return res.json(result);
})

app.listen(process.env.PORT || "3000");
