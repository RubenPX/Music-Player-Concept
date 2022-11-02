async function main() {
    albumInfos = await fetch("playlist.json").then(async res => await res.json())
}
main()
