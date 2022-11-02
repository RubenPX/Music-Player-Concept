async function main() {
    albumInfos = await fetch("playlist.json").then(async res => await res.json())
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
}
