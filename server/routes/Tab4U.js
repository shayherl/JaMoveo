const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const BASE_URL = 'https://www.tab4u.com';

function buildAlignedChordHtml(rawHtml, lyricsLine) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  const parts = rawHtml
    .split(/<\/?span[^>]*>/)        // מפרק את הספאנים של Tab4U
    .filter(p => p !== '')
    .map(p => p.replace(/&nbsp;/g, ' ')); // ממיר רווחים לאות רגילה

  const result = [];
  let index = 0;

  for (const part of parts) {
    const leadingSpaces = part.match(/^ */)?.[0].length || 0;
    const chord = part.trim();

    const position = index + leadingSpaces;

    // רווחים עד למיקום האקורד
    while (result.length < position) {
      result.push('<span style="display:inline-block; width:1ch;"> </span>');
    }

    // האקורד עצמו, עם רוחב קבוע
    result.push(`<span style="display:inline-block; width:${chord.length}ch; font-weight:bold; color:blue;">${chord}</span>`);

    index = result.length;
  }

  // השלמה לרוחב שורת המילים
  while (result.length < lyricsLine.length) {
    result.push('<span style="display:inline-block; width:1ch;"> </span>');
  }

  return result.join('');
}




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

        if (songLink && songName && artistName) {
            results.push({
            title: songName,
            artist: artistName,
            link: songLink
            });
        }
        });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch search results');
  }
});

router.get('/song', async (req, res) => {
  const songPath = req.query.link;
  if (!songPath) return res.status(400).send('Missing song path');

  try {
    const url = new URL(songPath, BASE_URL).href;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const lines = [];

    $('#songContentTPL table tbody tr').each((_, tr) => {
    const songLine = $(tr).find('td.song').text().replace(/\u00a0/g, ' ');
    const chordsHtml = $(tr).find('td.chords, td.chords_en').html(); // זה מחזיר את הספאן של Tab4U

    if (songLine || chordsHtml) {
        let alignedChords = '';
        try {
        alignedChords = buildAlignedChordHtml(chordsHtml, songLine);
        
        } catch (err) {
        console.error('Failed to align chords:', err.message);
        }
        const cleanLyrics = songLine.replace(/[\n\r\t]/g, '').trim();
        lines.push({ lyrics: cleanLyrics, chordsHtml: alignedChords });
    }
    });

    const fullTitle = $('font.blackNone').text().split('לשיר')[1]?.trim() || '';
    const title = fullTitle.split('של')[0]?.trim() || '';
    const artist = $('a.artistTitle').text().trim();

    res.json({ title, artist, lines });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch song details');
  }
});





module.exports = router;
