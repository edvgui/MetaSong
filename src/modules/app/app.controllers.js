const helpers = require('./app.helpers');
const constants = require('./../../config/constants');
const fs = require('fs');

async function homeWithData(req, res) {
    const id = req.params.id;
    if (id) req.session.data = await helpers.updateMetadata(req.session.data, id);
    res.redirect('/app#data');
}

async function homeWithSearch(req, res) {
    if (req.error)
        req.session.errors = [req.error.message];
    else {
        req.session.errors = undefined;
        req.session.search = req.body.search_bar;
        req.session.results = await helpers.deezerSearch(req.session.search);
    }
    res.redirect('/app#search');
}

async function homeWithFile(req, res) {
    if (req.error)
        req.session.errors = [req.error.message];
    else if (!req.file)
        req.session.errors = ["Something went wrong, please make sure you have select a file."];
    else {
        req.session.success = "You successfully imported your song!";
        req.session.errors = undefined;
        req.session.file = req.file;
        const data = await helpers.readMetadata(req.session.file);
        if (data.success) req.session.data = data.data;
        else req.session.errors = [data.error];
        const cover = await helpers.readMetadataCover(req.session.file, req.session.userId);
        if (data.success && cover.success) req.session.data.cover = '/app/img/' + req.session.userId + '.png';
    }
    res.redirect('/app#import');
}

async function home(req, res) {
    res.render('index', {
        title: 'Home',
        file: req.session.file,
        search: req.session.search,
        results: req.session.results,
        data: req.session.data,
        errors: req.session.errors,
        success: req.session.success,
    });

    req.session.errors = undefined;
    req.session.success = undefined;
}

async function downloadSong(req, res) {
    if (req.session.file && req.session.data)
        return res.download(req.session.file.path, helpers.generateFileName(req.session.data));
    else
        return res.redirect('/app');
}

async function saveSong(req, res) {
    if (req.error) req.session.errors = req.error.message.split("\n");
    if (req.session.file) {
        const data = {
            title: req.body.songTitle,
            artist: req.body.songArtist,
            album: req.body.songAlbum,
            album_artist: req.body.songAlbumArtist,
            track: req.body.trackNumber,
            disc: req.body.discNumber,
            date: req.body.songYear,
            genre: req.body.songGenre
        };
        const result = await helpers.writeMetadata(req.session.file, data);
        if (!result.success) req.session.errors = result.error.split("\n");
        const options = ((req.file)
            ? { attachments: [req.file.path ] }
            : ((req.session.data.cover && req.session.data.cover.charAt(0) !== "/")
                ? { attachments: [req.session.data.cover] }
                : undefined));
        if (options) {
            const result2 = await helpers.writeMetadataCover(req.session.file, options);
            if (!result2.success) req.session.errors = result.error.split("\n");
            else await helpers.readMetadataCover(req.session.file, req.session.userId);
        }
    }
    if (!req.session.errors) req.session.success = "You successfully saved your song!";
    return res.redirect('/app');
}

async function addToLibrary(req, res) {

}

async function resetSong(req, res) {
    if (req.session.file) {
        const data = await helpers.readMetadata(req.session.file);
        if (data.success) req.session.data = data.data;
        else req.session.errors = [data.error];
        const cover = await helpers.readMetadataCover(req.session.file, req.session.userId);
        if (data.success && cover.success) req.session.data.cover = '/app/img/' + req.session.userId + '.png';
    }
    res.redirect('/app');
}

async function getImage(req, res) {
    if (req.params.img !== req.session.userId + '.png') return res.end();
    try {
        const img = fs.readFileSync('src/uploads/imgs/' + req.params.img);
        res.writeHead(200, {'Content-Type': 'image/gif'});
        res.end(img, 'binary');
    } catch (error) {
        res.end();
    }
}

async function getSong(req, res) {
    if (req.params.song !== req.session.userId + '.mp3') return res.end();
    try {
        const song = fs.readFileSync('src/uploads/songs/' + req.params.song);
        res.writeHead(200, {'Content-Type': 'audio/mpeg'});
        res.end(song);
    } catch (error) {
        res.end();
    }
}

module.exports = {
    home,
    homeWithFile,
    homeWithSearch,
    homeWithData,
    downloadSong,
    saveSong,
    addToLibrary,
    resetSong,
    getImage,
    getSong
};