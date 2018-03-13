const readFile = require("util").promisify(require("fs").readFile)
const twitter = require("./twitterAPI-wrapper")

async function main() {
	await twitter.postStatus("おきてえええええ", [await twitter.postMP4(await readFile("medias/okite.mp4"))])
}
main()
