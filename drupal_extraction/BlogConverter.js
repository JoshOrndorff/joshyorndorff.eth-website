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
	"48adaf86-7b3d-4006-8c0a-61ae91c6be2b",
	"34efb7b7-d41c-45d3-a788-de3c381c38d3",
	"b3e699fb-1497-4aaf-8991-72180a327bb9",
	"ccf1ba95-8be3-4df7-a58a-16b590bb02f0",
	"56298599-460e-4730-94fb-660322c13b59",
	"995c67b7-ff19-4557-9676-d357885ffc87",
	"2620e6ac-2f2a-4419-8f0c-cf752dd851d5",
	"3ec2104d-b8f4-4108-a718-a273d9b3b803",
	"502100d6-46e5-49f7-a8b5-9aa43b114497",
	"96bee505-7070-4830-81d3-41c4b391b43b",
	"f0729873-c093-4404-aefe-c0fc5f5c5754",
	"ec9ea9e4-cad1-43f5-9980-63e1664419c1",
	"b0187722-414f-49bb-9ee0-5b0b8fd01928",
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

		// CAUTION! alt is used for the Korea post, but I think some older ones might use title or both.
		// Possibly even slightly different versions for each :scream:
		contents += `![${photo.alt}](${photo.filename})\n`
	}
	
	writeFileSync(`${dashedTitle}/index.md`, contents, {flag: "w"});	
}
