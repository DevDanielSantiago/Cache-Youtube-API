const api = require("./api");
const querystring = require("querystring");
const cache = require("./cache");

class Youtube {
  async playlists(options) {
    const params = querystring.stringify(options);

    const cached = await cache.get(params);

    if (cached) {
      return cached;
    }

    const { data } = await api.get(`/playlists?${params}&part=snippet&key=${process.env.YOUTUBE_TOKEN}`);
    
    const playlists = data.items.map((playlist) => {
      return {
        id: playlist.id,
        publishedAt: playlist.snippet.publishedAt,
        channelId: playlist.snippet.channelId,
        channelTitle: playlist.snippet.channelTitle,
        title: playlist.snippet.title,
        thumbnails: playlist.snippet.thumbnails.medium.url,
        description: playlist.snippet.description,
      };
    });

    const response = {
      prevPageToken: data.prevPageToken ? data.prevPageToken : '',
      nextPageToken: data.nextPageToken ? data.nextPageToken : '',
      playlists: playlists
    }

    cache.set(params, response, 60 * 15);

    return response;
  }

  async playlistItems(options) {
    const params = querystring.stringify(options);

    const cached = await cache.get(params);

    if (cached) {
      return cached;
    }

    const { data } = await api.get(`/playlistItems?${params}&part=snippet&maxResults=10&key=${process.env.YOUTUBE_TOKEN}`);

    const videos = data.items.map((video) => {
      return {
        id: video.id,
        videoId: video.snippet.resourceId.videoId,
        playlistId: video.snippet.playlistId,
        publishedAt: video.snippet.publishedAt,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
        title: video.snippet.title,
        thumbnails: video.snippet.thumbnails.medium.url,
        description: video.snippet.description,
      };
    });

    const response = {
      prevPageToken: data.prevPageToken ? data.prevPageToken : '',
      nextPageToken: data.nextPageToken ? data.nextPageToken : '',
      videos: videos
    }

    cache.set(params, response, 60 * 15);

    return response;
  }

  async videos(options) {
    const params = querystring.stringify(options);

    const cached = await cache.get(params);

    if (cached) {
      return cached;
    }

    const { data }  = await api.get(`videos?${params}&part=snippet&key=${process.env.YOUTUBE_TOKEN}`)

    const response = data.items.map((video) => {
      return {
        id: video.id,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        publishedAt: video.snippet.publishedAt,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
        title: video.snippet.title,
        thumbnails: video.snippet.thumbnails.standard.url,
        description: video.snippet.description,
      };
    });

    cache.set(params, response, 60 * 15);

    return response;
  }
}

module.exports = new Youtube();
