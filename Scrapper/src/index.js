import { firefox } from "playwright"
import fs from "fs"

async function getAlbumInfo(context, albumInfo) {
    const page = await context.newPage()
    await page.goto("https://music.youtube.com/browse/" + albumInfo.url);

    let musics = await page.evaluate(async () => {
        return Array.from(document.querySelectorAll("ytmusic-shelf-renderer>#contents>ytmusic-responsive-list-item-renderer")).map(itm => {
            let linkBase = itm.querySelector("a")
            return {
                title: linkBase.innerText,
                duration: itm.querySelector(".fixed-columns.style-scope.ytmusic-responsive-list-item-renderer yt-formatted-string").attributes.title.value,
                url: linkBase.attributes.href.value.split("?v=")[1].split("&list=")[0],
            }
        })
    })

    page.close()
    console.log("Album " + albumInfo.title + " processed")

    return {...albumInfo, playlist: musics}
}

async function main() {
    console.group("Configuring browser")
    const browser = await firefox.launch({ headless: true })

    console.log("Creating context")
    const context = await browser.newContext({
        javaScriptEnabled: true
    })
    context.setDefaultTimeout(60 * 1000)

    console.log("Creating page")
    const page = await context.newPage();

    console.log("Navigating...")
    // Insert YT Music Channel here
    await page.goto("https://music.youtube.com/channel/UC0E8jwZJtGZa7y-SpUxVIeg")

    console.log("Accepting YT Terms")
    await page.click("[jsname='b3VHJd']") //! Aceptamos los terminos y condiciones de YT
    console.groupEnd()

    try {
        console.log("Getting albums")
        await page.click(".ytmusic-shelf a")
    } catch (err) {
        await page.screenshot({path: 'screenshot.png'});
        throw err
    }

    await new Promise(res => setTimeout(res, 1000))
    let listAlbums = await page.evaluate(async () => {
        return Array.from(document.querySelectorAll("ytmusic-grid-renderer>#items>ytmusic-two-row-item-renderer>a")).map(itm => {
            return {
                title: itm.attributes.title.value,
                url: itm.attributes.href.value.split("/")[1], // https://music.youtube.com/browse/
                img: itm.querySelector("img").attributes.src.value
            }
        })
    })

    // Conseguimos los datos de forma paralela
    console.group("Getting " + listAlbums.length + " albums info")
    let FullAlbumInfos = await Promise.all(listAlbums.map((v) => getAlbumInfo(context, v)))
    console.groupEnd()

    await browser.close()

    console.log("Saving info")
    fs.writeFileSync("./generated/playlist.json", JSON.stringify(FullAlbumInfos), {encoding: "utf-8"})
}

main()