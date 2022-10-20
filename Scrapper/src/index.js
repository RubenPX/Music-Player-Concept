import { chromium } from "playwright"

async function main() {
    console.group("Configuring browser")
    const browser = await chromium.launch({ headless: false })

    console.log("Creating context")
    const context = await browser.newContext({
        javaScriptEnabled: true
    })

    console.log("Creating page")
    const page = await context.newPage();

    console.log("Navigating...")
    // Insert YT Music Channel here
    await page.goto("https://music.youtube.com/channel/UC0E8jwZJtGZa7y-SpUxVIeg")

    console.log("Accepting YT Terms")
    await page.click("[jsname='b3VHJd']") //! Aceptamos los terminos y condiciones de YT
    console.groupEnd()

    console.log("Getting albums")
    await page.click(".ytmusic-shelf a")

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
}

main()