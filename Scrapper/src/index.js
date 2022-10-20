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

}

main()