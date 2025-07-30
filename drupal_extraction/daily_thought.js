
const fetch = require('node-fetch');
const {existsSync, writeFileSync} = require('fs');


// I tried increasing the pagination to 500 to fit results into a single page, but I guess
// The server sets the limit to 50.
// I used the syntax &page%5Blimit%5D=5 &page[limit]=5
async function downloadDailyThoughts() {

	// I got this query using the JSON:API explorer
	// https://joshyorndorff.com/jsonapi/explorer/app
	const firstQuery = 'https://joshyorndorff.com/jsonapi/node/daily?fields[node--daily]=body,created,title&sort=created';

	// An array to store all the processed thought objects
	let allDailyThoughts = [];
	let query = firstQuery;

	// Results from drupal are paged, so we have to loop until there are no
	// more pages
	while (typeof query !== "undefined") {
		console.log("entering loop");
		// console.log(typeof query);
		// console.log(typeof query !== undefined);

		let response = await fetch(query)
			.then(response => response.json());
		let oldThoughts = response.data.map(datum => datum.attributes);

		// console.log(thoughts);

		// Analyze the first several thoughts first
		for ({ created, title, body } of oldThoughts) {

			console.log(`\n${title} (${created})`);
			// console.log(body.value);

			let newThought = {
				title,
				date: created,
				body: body.value,
			};

			allDailyThoughts.push(newThought);

			// Write the thought to a file
			// create a file name from the title
			// https://stackoverflow.com/a/2993211
			let filename = title;
			filename = filename.replace(/\W+/g, '-');
			filename += '-';
			filename += created.substring(0, 10);
			filename += ".md";

			// Check if there is a name conflict
			if (existsSync('foo.txt')) {
			console.log(`NAME CONFLICT!!!!!! ${filename}`);
			}

			let contents = `+++
title = "${title}"
date = "${created}"
+++

${body.value}
			`
			writeFileSync(filename, contents);
		}

		query = response.links.next;
		console.log("\n\n#############################################");
		console.log(`Checking for next page: ${query}`);
		console.log(`Processed ${allDailyThoughts.length} thoughs so far.`);
		console.log("#############################################");
	}

	// How many results did we process
	console.log(`Processed ${allDailyThoughts.length} values`);
	writeFileSync("dailyThoughts.json", JSON.stringify(allDailyThoughts));
}

downloadDailyThoughts();
