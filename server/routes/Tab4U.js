const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const BASE_URL = 'https://www.tab4u.com';

// help method for /song
function extractChordsAndSpaces(html) {
  return html
    .replace(/<span[^>]*>(.*?)<\/span>/g, '$1')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/[\n\r\t]/g, '')
    .trim();
}

// search results
router.get('/search', async (req, res) => {
  const query = req.query.q;

  if (!query) return res.status(400).send('Missing query param');
  try {
    const url = `${BASE_URL}/resultsSimple?tab=songs&q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results = [];

    $('td.songTd1').each((_, el) => {
        const $el = $(el);
        const songLink = $el.find('a').attr('href');
        const artistName = $el.find('.aNameI19').text().trim().replace(/[ /]+$/, '');
        const songName = $el.find('.sNameI19').text().trim().replace(/[ /]+$/, '');
        const photoSpan = $el.find('span.ruArtPhoto');
        const styleAttr = photoSpan.attr('style') || '';
        const match = styleAttr?.match(/url\(['"]?(.*?)['"]?\)/);
        const artistImagePath = match ? match[1] : '';
        const artistImage = artistImagePath ? new URL(artistImagePath, BASE_URL).href : null;

        if (songLink && songName && artistName) {
            results.push({
            title: songName,
            artist: artistName,
            link: songLink,
            photo: artistImage 
            });
        }
        });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch search results');
  }
});

// song details
router.get('/song', async (req, res) => {
  const songPath = req.query.link;
  if (!songPath) return res.status(400).send('Missing song path');

  try {
    const url = new URL(songPath, BASE_URL).href;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const lines = [];

    $('#songContentTPL table tbody tr').each((_, tr) => {
      const songLine = $(tr).find('td.song').html() || '';
      const chordsHtml = $(tr).find('td.chords, td.chords_en').html() || '';
      const cleanedChords = extractChordsAndSpaces(chordsHtml);
      const cleanedSong = songLine.replace(/[\n\t\r]/g, '');
      lines.push({ lyrics: cleanedSong, chords: cleanedChords });
    });

    const fullTitle = $('font.blackNone').text().split('לשיר')[1]?.trim() || '';
    const title = fullTitle.split('של')[0]?.trim() || '';
    const artist = $('a.artistTitle').text().trim();

    res.json({ title, artist, lines});
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch song details');
  }
});

module.exports = router;