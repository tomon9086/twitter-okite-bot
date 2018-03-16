const promisify = require("util").promisify
const fs = require("fs")
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const twitter = require("./twitterAPI-wrapper")

const repliedIdLogFile = "replied-id.log"

// setInterval(async () => {
const hoge = async () => {
	// const repliedIdLog = await readFile(repliedIdLogFile, "utf-8")
	const repliedIds = (await readFile(repliedIdLogFile, "utf-8")) ? (await readFile(repliedIdLogFile, "utf-8")).split("\n") : []
	// await twitter.getHomeTimeline(100)
	awaitForEach((await twitter.search("ねむ OR 眠", 100)).statuses, async (v, i) => {
		if(v.retweeted_status) return
		if(repliedIds.indexOf(v.id_str) > -1) return
		// const text = ""	// v.entities から @ユーザー名 とか URL とかを取り除いたテキストを使いたい
		// console.log("text", v.text, "\n url:", "https://twitter.com/statuses/" + v.id_str)
		if(v.text === "ねむ" || v.text === "ねむい" || v.text === "ねむたい" || v.text === "眠い" || v.text === "眠たい") {
			await twitter.postStatus(`@${ v.user.screen_name } ` + "おきてえええええ", [await twitter.postMP4(await readFile("medias/okite.mp4"))], v.id_str)
			// console.log("text", v.text, "\n url:", "https://twitter.com/statuses/" + v.id_str)
			await writeFile(repliedIdLogFile, await readFile(repliedIdLogFile, "utf-8") + (await readFile(repliedIdLogFile, "utf-8") ? "\n" : "") + v.id_str, "utf-8")
			repliedIds.push(v.id_str)
		}
	})
	// console.log((await twitter.search("ねむ OR 眠", 100)).statuses.map((v) => { return v.text }).join("\n*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*\n"))
};hoge()
// }, 60000)

async function awaitForEach(array, cb) {
	for(let i = 0; i < array.length; i++) {
		await cb(array[i], i, array)
	}
}
