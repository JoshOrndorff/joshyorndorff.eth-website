// The goal of this file is to convert a single blog post from my drupal site to
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
// SELECT * FROM `node` WHERE `type` = "photo_gallery" ORDER BY `nid` ASC;
// Would be better to do Descending probably

const fetch = require('node-fetch');
const {writeFileSync, mkdirSync, createWriteStream} = require('fs');
const http = require('https');

const baseUrl = "https://joshyorndorff.com";

downloadBlog("c41048c0-c2a1-4dad-b208-30edd45ca5d0");

async function downloadBlog(uuid) {

	// There are some docs and examples at
	// https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/fetching-resources-get
	// I looked up this node id and uuid up manually. We'll need a better way to automate.
	const query = `https://joshyorndorff.com/jsonapi/node/photo_gallery/${uuid}?include=taxonomy_vocabulary_2,field_photos&fields[taxonomy_term--vocabulary_2]=name&fields[file--file]=uri,url`;

	let response = await fetch(query)
		.then(response => response.json());

	console.log(response);
	console.log("END OF RESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSE");

	let {title, created} = response.data.attributes;
	let body = response.data.attributes.body.value; // There is also `processed` which appears to be html
	// Construct in-memory mapping for included data:
	// * image IDs => url where we can download it.
	// * tag ID => the actual tag
	let photoUrlMap = {};
	let tagMap = {};
	for (included of response.included) {
		if (included.type == "file--file") {
			photoUrlMap[included.id] = baseUrl + included.attributes.uri.url;
		}
		else if (included.type == "taxonomy_term--vocabulary_2") {
			tagMap[included.id] = included.attributes.name;
		}
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
		console.log(`Photo Download Started: ${photo.downloadUrl}`);
		// Download the file from the drupal site
		// https://stackoverflow.com/a/11944984/4184410
		const file = createWriteStream(`${dashedTitle}/${photo.filename}`);
		const request = http.get(photo.downloadUrl, function(response) {
			response.pipe(file);

			// after download completed close filestream
			file.on("finish", () => {
				file.close();
				console.log(`Photo Download Completed: ${photo.downloadUrl}`);
			});
		});

		// CAUTION! alt is used for the Korea post, but I think some older ones might use title or both.
		// Possibly even slightly different versions for each :scream:
		contents += `![${photo.alt}](${photo.filename})\n`
	}
	
	writeFileSync(`${dashedTitle}/index.md`, contents, {flag: "w"});

	
}
