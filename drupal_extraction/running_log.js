// The goal of this file is to query my drupal site and extract all of the data
// from the running / biking log.
// Save it locally in both json and csv format for later use in a more modern data visualization tool

const fetch = require('node-fetch');
const {existsSync, writeFileSync} = require('fs');



async function downloadRunningLog() {

	// I originally got queries using the JSON:API explorer
	// https://joshyorndorff.com/jsonapi/explorer/app
	// https://joshyorndorff.com/jsonapi/explorer/app?location=https%3A//joshyorndorff.com
	// https://www.drupal.org/project/jsonapi_explorer
	// but that project is no longer working for me.

	// There are some docs and examples at
	// https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/fetching-resources-get
	const firstQuery = 'https://joshyorndorff.com/jsonapi/node/run';

	// An array to store all the processed thought objects
	let allRunLogs = [];
	let query = firstQuery;

	// Results from drupal are paged, so we have to loop until there are no
	// more pages
	while (typeof query !== "undefined") {
		console.log("entering loop");
		console.log(typeof query);
		console.log(typeof query !== undefined);

		let response = await fetch(query)
			.then(response => response.json());
		let oldRuns = response.data.map(datum => datum.attributes);

		console.log(oldRuns[0]);


		// Analyze the first several thoughts first
		for ({ field_date, field_distance, field_type, body } of oldRuns) {

			console.log(`\n${field_date}: ${field_distance}km (${field_type})`);
			console.log(body.value);

			let newRun = {
				date: field_date,
				distance: field_distance,
				notes: body.value,
				type: field_type, // RUN or BIKE
			};

			allRunLogs.push(newRun);
		}

		query = response.links.next;
		console.log("\n\n#############################################");
		console.log(`Checking for next page: ${query}`);
		console.log(`Processed ${allRunLogs.length} runs so far.`);
		console.log("#############################################");
	}

	// How many results did we process
	console.log(`Processed ${allRunLogs.length} values`);
	writeFileSync("runningLog.json", JSON.stringify(allRunLogs));
}

downloadRunningLog();
