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
const {writeFileSync, mkdirSync, createWriteStream} = require('fs');
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
	"18db1322-55b9-41fe-a459-feff2024b4f8", // Mini sharpie
	// "2e0c32f6-e428-4c7b-b0fd-1989ba8bd6ac", // Resolutions
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
	mkdirSync(dashedTitle);

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
		console.log(`  Photo Download Started: ${photo.downloadUrl}`);
		// Download the file from the drupal site
		// https://stackoverflow.com/a/11944984/4184410
		const file = createWriteStream(`${dashedTitle}/${photo.filename}`);
		const request = http.get(photo.downloadUrl, function(response) {
			response.pipe(file);

			// after download completed close filestream
			file.on("finish", () => {
				file.close();
				console.log(`  Photo Download Completed: ${photo.downloadUrl}`);
			});
		});

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
	
	writeFileSync(`${dashedTitle}/index.md`, contents, {flag: "w"});	
}
