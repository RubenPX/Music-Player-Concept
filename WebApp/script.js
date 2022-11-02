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
}
