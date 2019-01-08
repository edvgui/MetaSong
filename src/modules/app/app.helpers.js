const https = require('https');
const ffmetadata = require('ffmetadata');
const fs = require('fs');

function queryData(address) {
    return new Promise(function (resolve) {
        https.get(address, function (resp) {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', function (chunk) {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', function () {
                resolve({ success: true, data: JSON.parse(data) });
            });

        }).on("error", function (err) {
            resolve({ success: false, error: "Error: " + err.message });
        });
    });
}

function deezerSearch(searchInput) {
    return queryData('https://api.deezer.com/search?q=' + searchInput);
}

function deezerTrack(id) {
    return queryData('https://api.deezer.com/track/' + id);
}

function deezerAlbum(id) {
    return queryData('https://api.deezer.com/album/' + id);
}

function deezerArtist(id) {
    return queryData('https://api.deezer.com/artist/' + id);
}

function readMetadata(file) {
    return new Promise(function (resolve) {
        ffmetadata.read(file.path, function (err, data) {
            if (err) resolve({success: false, error: "Error reading metadata : " + err.message});
            else resolve({success: true, data: data});
        });
    });
}

function readMetadataCover(file, userId) {
    return new Promise(function (resolve) {
        try {
            fs.unlinkSync('./src/uploads/imgs/' + userId + ".png");
        } catch (error) {
            // do nothing
        }
        ffmetadata.read(file.path, { coverPath: './src/uploads/imgs/' + userId + ".png" }, function (err, data) {
            if (err) resolve({success: false, error: "Error reading metadata : " + err.message});
            else resolve({success: true, data: data });
        });
    });
}

function writeMetadata(file, data) {
    return new Promise(function (resolve) {
        ffmetadata.write(file.path, data, function(err) {
            if (err) resolve({ success: false, error: "Error writing metadata : " + err.message});
            else resolve({ success: true });
        });
    });
}

function writeMetadataCover(file, options) {
    return new Promise(function (resolve) {
        ffmetadata.write(file.path, {}, options, function(err) {
            if (err) resolve({ success: false, error: "Error writing metadata : " + err.message});
            else resolve({ success: true });
        });
    });
}

async function updateMetadata(metadata, trackId) {
    const track = await deezerTrack(trackId);
    if (!track.success) return metadata;
    const track_data = track.data;
    if (track_data.title) metadata.title = track_data.title;
    if (track_data.artist && track_data.artist.name) metadata.album_artist = track_data.artist.name;
    if (track_data.contributors) {
        let contributors = "";
        for (let i = 0; i < track_data.contributors.length; i++) {
            contributors += track_data.contributors[i].name;
            if (i < track_data.contributors.length - 1) contributors += ", ";
        }
        metadata.artist = contributors;
    }
    if (track_data.track_position) metadata.track = track_data.track_position;
    if (track_data.disc_number) metadata.disc = track_data.disc_number;
    if (track_data.release_date) metadata.date = track_data.release_date.split("-")[0];

    if (!track_data.album) return metadata;
    const album = await deezerAlbum(track_data.album.id);
    if (!album.success) return metadata;
    const album_data = album.data;
    if (album_data.title) metadata.album = album_data.title;
    if (album_data.genres && album_data.genres.data && album_data.genres.data.length > 0) {
        let genres = "";
        for (let i = 0; i < album_data.genres.data.length; i++) {
            genres += album_data.genres.data[i].name;
            if (i < album_data.genres.data.length - 1) genres += ", ";
        }
        metadata.genre = genres;
    }
    if (album_data.cover_xl) metadata.cover = album_data.cover_xl;
    else if (album_data.cover_big) metadata.cover = album_data.cover_big;
    else if (album_data.cover_medium) metadata.cover = album_data.cover_medium;
    else if (album_data.cover_small) metadata.cover = album_data.cover_small;

    return metadata;
}

function generateFileName(metadata) {
    return metadata.album + " - " + metadata.track + " - " + metadata.artist + " - " + metadata.title + ".mp3";
}

module.exports = {
    deezerSearch,
    readMetadata,
    readMetadataCover,
    writeMetadata,
    writeMetadataCover,
    updateMetadata,
    generateFileName
};