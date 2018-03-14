const promisify = require("util").promisify
const readFile = promisify(require("fs").readFile)
const writeFile = promisify(require("fs").writeFile)
const twitter = require("./twitterAPI-wrapper")

const repliedIdLogFile = "replied-id.log"

setInterval(async () => {
	const repliedIds = (await readFile(repliedIdLogFile, "utf-8")).split("\n")
	(await twitter.getHomeTimeline(100)).forEach(async (v, i) => {
		if(v.retweeted_status) return
		if(repliedIds.indexof(v.id_str) > -1) return
		if(v.text === "ねむい" || v.text === "ねむたい" || v.text === "眠い" || v.text === "眠たい") {
			await twitter.postStatus("おきてえええええ", [await twitter.postMP4(await readFile("medias/okite.mp4"))], v.id_str)
			// console.log("text", v.text, "\n url:", "https://twitter.com/statuses/" + v.id_str)
			await writeFile(repliedIdLogFile, await readFile(repliedIdLogFile, "utf-8") + "\n" + v.id_str, "utf-8")
			repliedIds.push(v.id_str)
		}
	})
}, 60000)
