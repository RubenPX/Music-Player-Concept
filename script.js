let albumInfos = []
let AlbumAuthor = "Hola Beats"
let selectedAlbum = {};
async function main() {
    // https://github.com/RubenPX/Music-Player-Concept/tree/master/Scrapper/generated
    albumInfos = await fetch("https://raw.githubusercontent.com/RubenPX/Music-Player-Concept/master/Scrapper/generated/playlist.json").then(async res => await res.json())
    setupAlbums()
}
main()

function setupAlbums() {
    document.getElementById("AlbumList").innerHTML = ""

    document.getElementById("AlbumList").innerHTML = albumInfos.map((album, index) => {
        return `<div class="album" AlbumID="${index}">
            <img src="${album.img}">
            <div class="album-title">${album.title}</div>
        </div>`;
    }).join(" ");

    [...document.querySelectorAll("#AlbumList > [AlbumID]")].map(DOMItem => {
        DOMItem.addEventListener("click", () => SetAlbum(DOMItem.getAttribute("AlbumID")))
    })

    SetAlbum(0)
}

function SetAlbum(num) {
    const album = albumInfos[num]
    document.getElementById("SongList").innerHTML = `<h1>${album.title}</h1>`
    document.getElementById("SongList").innerHTML += album.playlist.map((song, index) => {
        return `<div class="song" SongID="${index}" albumTitle="${album.title}" songURL="${song.url}" IMGAlbum="${album.img}">
        <img src="${album.img}" />
        <div>${song.title}</div>
        <div class="duration">${song.duration}</div>
      </div>`
    }).join(" ");

    [...document.querySelectorAll("#SongList > [songID]")].map(DOMItem => {
        DOMItem.addEventListener("click", () => {
            albumTitle = DOMItem.getAttribute("albumTitle")
            songURL = DOMItem.getAttribute("songURL")
            imgURL = DOMItem.getAttribute("IMGAlbum")
            songTitle = DOMItem.querySelector("div").innerText
            PlayMusic(songURL, songTitle, albumTitle, imgURL)
        })
    })
}

function PlayMusic(songID, songTitle, albumTitle, IMGAlbum) {
    document.querySelector("#CurrentPlay .info .song .name").innerHTML = songTitle
    document.querySelector("#CurrentPlay .info .song .artist").innerHTML = albumTitle
    document.querySelector("#CurrentPlay .info img").setAttribute("src", IMGAlbum)

    player.loadVideoById(songID)
}


// YOUTUBE API IFRAME

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640'
    });
}

function PlayPause() {
    const state = player.getPlayerState();
    if (state === 1) {
        player.pauseVideo()
    } else {
        player.playVideo()
    }
}

document.getElementById("playPause").addEventListener("click", () => PlayPause())