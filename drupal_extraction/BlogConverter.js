// The goal of this file is to convert a series of blog posts from my old drupal site to
// a workable format for use in my new hugo site.
//
// Data to keep:
// * Title
// * Creation time
// * Full text
// * Images
// * Image captions
// * Tags
//
// Data to maybe forget, or maybe keep somewhere but not render:
// * Comments
// * Comment hierarchy
//
// Got some data about this post using PHPMYADMIN and the node table
// SELECT * FROM `node` WHERE `type` = "photo_gallery" ORDER BY `nid` DESC;

const fetch = require('node-fetch');
const {existsSync, writeFileSync, mkdirSync, createWriteStream} = require('fs');
const http = require('https');

const baseUrl = "https://joshyorndorff.com";

uuids = [
	// This is a draft of 2017 resolutions that were never published.
	// It is node ID 2080
	// "8a1496ee-76db-4b95-a2a7-5846f725d1be",

	// Seven total 2015 blogs
	// "12fc9cb4-d5fa-4535-8c17-7df91557f1b3", // States
	// "ec657566-6c68-440b-9b02-6057fa266e5d", // Voting
	// "540cb229-74af-41fb-bcfe-b22948a2b805", // Motorcycle
	// "d273d557-759d-4f37-947f-aff855f7502a", // Logging
	// "a61cd175-1221-458f-8281-9931af971cf3", // Life in Alaska
	// "18db1322-55b9-41fe-a459-feff2024b4f8", // Mini sharpie
	// "2e0c32f6-e428-4c7b-b0fd-1989ba8bd6ac", // Resolutions

	// 2014
	// "6329b052-0970-465c-8b84-997830680caf", // Wild Roadtrip - Lube n Goinc

	// East coast bike trip
	// "dd0a2559-73a7-4911-a48d-7acab3fd8914", // Thanks
	// "48279fd0-c266-48b9-88aa-9bc32080fd2c", // day 7
	// "739bd391-ff24-464f-9182-8b276bca1789",
	// "0d3e752d-e610-4c97-850c-48893b756cfd", // day 5 was goofed bad. Try it again after others succeed
	// "0001b5a2-46ca-4597-8199-49dad6f66446",
	// "d1acf913-8546-44dd-bb41-c1d30526a540",
	// "bfdee918-6e89-41cf-b8d7-52ef64999e09", 
	// "5686d3ca-5a45-4d9a-97f8-b95dc29d5e81", // day 1
	// "91ae7974-857b-40a5-8e06-9f6a41b865fb", // day 0 - prep

	// "d77ae626-0eda-4067-9559-e7e4d1448733", // resolutions 2014
	// "00513030-3b63-435b-8c79-0c25192c4c7d", // Flight school in Needles
	"2eb13699-0893-4143-a685-6dbd3330a10b", // NC Thanksgiving

	// I'm on page three on phpmyadmin

];

download_all(uuids);

async function download_all(uuids) {
	for(uuid of uuids) {
		await downloadBlog(uuid);
	}
}

async function downloadBlog(uuid) {

	// There are some docs and examples at
	// https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/fetching-resources-get
	// I looked up this node id and uuid up manually. We'll need a better way to automate.
	const query = `https://joshyorndorff.com/jsonapi/node/photo_gallery/${uuid}?include=taxonomy_vocabulary_2,field_photos&fields[taxonomy_term--vocabulary_2]=name&fields[file--file]=uri,url`;

	let response = await fetch(query)
		.then(response => response.json());

	// console.log(response);
	// console.log("END OF RESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSE");

	let {title, created} = response.data.attributes;

	console.log(`Working on blog: ${title}`);
	let body = response.data.attributes.body.value; // There is also `processed` which appears to be html
	// Construct in-memory mapping for included data:
	// * image IDs => url where we can download it.
	// * tag ID => the actual tag
	let photoUrlMap = {};
	let tagMap = {};
	try {
		for (included of response.included) {
		if (included.type == "file--file") {
			photoUrlMap[included.id] = baseUrl + included.attributes.uri.url;
		}
		else if (included.type == "taxonomy_term--vocabulary_2") {
			tagMap[included.id] = included.attributes.name;
		}
	}
	} catch (error) {
		console.log("  Post contained neither images nor tags.");
	}
	
	let photos = [];
	for (photo_data of response.data.relationships.field_photos.data) {
		// console.log(photo_data);
		let downloadUrl = photoUrlMap[photo_data.id];
		photos.push({
			alt: photo_data.meta.alt,
			title: photo_data.meta.title,
			id: photo_data.id,
			downloadUrl,
			filename: downloadUrl.substring(downloadUrl.lastIndexOf('/') + 1),
		});
	}
	let tags = [];
	for (tag of response.data.relationships.taxonomy_vocabulary_2.data){
		tags.push(tagMap[tag.id]);
	}

	// Setup the directory and index file.
	// Pictures will be downloaded later
	// https://www.geeksforgeeks.org/node-js/how-to-create-a-directory-using-node-js/
	const dashedTitle = title.replace(/\W+/g, '-');
	if (!existsSync(dashedTitle)){
		mkdirSync(dashedTitle);
	}
	else {
		console.log(`Directory ${dashedTitle} already exists. Not creating it`);
	}

	let contents = `+++
title = "${title}"
date = "${created}"
tags = ${JSON.stringify(tags)}
categories = []
image = "todo.jpg"
+++

${body}

${photos.length > 0 ? "Photos:\n" : ""}
`
	for (photo of photos) {
		if (!existsSync(`${dashedTitle}/${photo.filename}`)){
			console.log(`  Photo Download Started: ${photo.downloadUrl}`);
			// Download the file from the drupal site
			// https://stackoverflow.com/a/11944984/4184410
			const file = createWriteStream(`${dashedTitle}/${photo.filename}`);
			const request = http.get(photo.downloadUrl, function(response) {
				response.pipe(file);

				// after download completed close filestream
				file.on("finish", () => {
					file.close();
					console.log(`  Photo Download Completed`);
				});
			});
		}
		else {
			console.log(`  Photo ${photo.downloadUrl} already exists; skipping it.`);
		}

		// Photo captions may be stored in the alt text or the title text.
		// Possibly even slightly different versions for each :scream:
		if (photo.alt !== "" && photo.title !== "") {
			console.log("WARNING! both alt and title text exist. Writing alt to file.");
			console.log(`alt  : ${photo.alt}`);
			console.log(`title: ${photo.title}`);

			contents += `![${photo.alt}](${photo.filename})\n`
		}
		else if (photo.title !== "") {
			contents += `![${photo.title}](${photo.filename})\n`
		}
		else {
			contents += `![${photo.alt}](${photo.filename})\n`
		}
	}
	
	if (!existsSync(`${dashedTitle}/index.md`)) {
		writeFileSync(`${dashedTitle}/index.md`, contents, {flag: "w"});
	}
	else {
		console.log("index file already exists. skipping it");
	}
}
