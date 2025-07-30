// The goal of this file is to convert a single blog post from my drupal site to
// a workable format for use in my new hugo site. I will start by narrowly focusing
// on the Korea trip blog.
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
// SELECT * FROM `node` WHERE nid='3178'; 
//
// NID: 3178
// VID: 3192 (IDK what this means, but I see it in the node table)
// UUID: 20402d1a-4ec4-4259-bc9d-256a0abe55cf
// Content type: Photo Gallery (machine_name: photo_gallery)


const fetch = require('node-fetch');
const {existsSync, writeFileSync, mkdir} = require('fs');



async function downloadKoreaBlog() {

	// There are some docs and examples at
	// https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/fetching-resources-get
	// I looked up this node id and uuid up manually. We'll need a better way to automate.
	const query = 'https://joshyorndorff.com/jsonapi/node/photo_gallery/20402d1a-4ec4-4259-bc9d-256a0abe55cf';

	let response = await fetch(query)
		.then(response => response.json());

	// console.log(response);
	// console.log("RESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSERESPONSE");

	let {title, created} = response.data.attributes;
	let body = response.data.attributes.value; // There is also `processed` which appears to be html
	let photos = [];
	for (photo_data of response.data.relationships.field_photos.data) {
		// console.log(photo_data);
		photos.push({
			alt: photo_data.meta.alt,
			title: photo_data.meta.title,
			id: photo_data.id,
		})
	}
	let tags = [];
	for (tag of response.data.relationships.taxonomy_vocabulary_2.data){
		// console.log(tag)
		tags.push({
			id: tag.id,
			name: "todo",
		});
	}

	// Setup the directory and index file.
	// Pictures will be downloaded later
	// https://www.geeksforgeeks.org/node-js/how-to-create-a-directory-using-node-js/
	await mkdir(title, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("New Directory created successfully !!");
      }
    });

	let contents = `+++
title = "${title}"
date = "${created}"
tags = ${JSON.stringify(tags)}
+++

${body}

Photos:

`
	for (photo of photos) {
		//TODO This is not the proper path to the file yet. We still need to find the 
		// path on the server, download it locally, and the record the local path.
		let path = photo.id

		// CAUTION! alt is used for the Korea post, but I think some older ones might use title or both.
		// Possibly even slightly different versions for each :scream:
		contents += `![${photo.alt}](path)\n`
	}
	

	writeFileSync(`${title}/index.md`, contents);

	
}

downloadKoreaBlog();
