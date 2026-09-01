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
	// "2eb13699-0893-4143-a685-6dbd3330a10b", // NC Thanksgiving

	// 2013
	// I'm on page three on phpmyadmin
	// "3bbad448-4b63-43f1-9a5b-f99e6d3425c5", // Alaska 2
	// "8803b904-887c-4790-8931-26b5265c1dd1", // Alaska 1
	// "9d48f0d3-5507-451a-bcf7-922cdb54791b", // NID 1319, India 3: hill, south, backwaters
	// "4d339176-201a-4d5e-b3d2-a3d131cd0b8c", // NID 1318, India 2: Agra Delhi
	// "7fd7b9c4-d942-43d8-9bf1-5ab57b1467cd", // NID 1316,  India 1: Mumbai

	// Cross Continent Bike trip
	// "251afce9-974b-416e-bd27-71f84d0d6a0f", // NID 1275, Statistics Suggestions
	// "61009107-f469-4fd1-bd3c-5958e2f25c8a", // Wrapping up thanks
	// "fd17292e-e186-4042-9a9a-19ca06fc445d", // Day 42
	// "98d5ad97-9924-4fb3-919a-bf1762b2c4ec",
	// "7e3dbc56-1eb4-46d0-92ce-c4777b0f00c0",
	// "c6b23ddd-75fd-435b-b429-75823f08702d",
	// "771d5ea8-8454-4032-ae6a-ac71583aa50d",
	// "c5b0b302-13c8-4a9b-8ca8-a58a3d2e8ba1",
	// "9ec31ddc-d9c7-4db0-b3c5-e67c4a6e6c78",
	// "ea2df73d-046d-42c7-ad1c-18607eae05ac",
	// "a247aea7-cd43-484a-bd51-9b59193418ab",
	// "7493f0ad-ff98-4b63-8680-c8d7b8e44482",
	// "1e9907ba-1fb8-44c0-acac-1918f8a80d03",
	// "3b9b9a95-a138-48fd-8a65-99b537e47b3f",
	// "753e3602-e4bb-4fa9-b05f-d63370dfd087",
	// "06c7a522-49ae-4d77-82c3-7dc764c4fd21",
	// "37545a2c-7da8-4df1-8eb1-04f9aab7a106",
	// "0e972538-680f-4245-8020-f6bab96d51dc",
	// "7753f89c-f28c-41e9-953e-92a5d0b8f31c", // Day 26

	// Begin page 4 in phpmyadmin
	// "f9f19096-cebf-43b7-ad3b-b95c380176b5", // Day 25
	// "205eb663-6ad8-4a09-b2cf-dedb0ade5554",
	// "246ae896-c3c7-4575-baf6-438789bcdca1",
	// "ea9e47cd-defd-44c0-9ff2-55a581bf4ff7",
	// "f3835128-93e3-4cdd-9e13-c013c287b08f",
	// "39d40da3-d622-4b77-af39-5671daa89544",
	// "fde6b005-10de-4250-9689-8d1d2ce4377e",
	// "ebc9ba3a-cc84-47dd-806c-70f27d8dafb8",
	// "b1decb6a-a32f-4ffe-97a9-d76e7f469d46",
	// "cbffe964-471d-42a2-ae7c-12b2c8ae8abb",
	// "2de1d814-c658-490a-8675-23a546586ef9",
	// "c9ca7a89-f56b-418a-b0f6-3d71778da285",
	// "d1d9e60c-c5cc-4d15-92f1-6a0011a67a28",
	// "853db43a-415b-41f9-839d-c9fd27de0c74",
	// "c16ab9f9-625e-4014-89ff-be044f849f5a",
	// "885292c3-291b-4488-a844-f7446cdb174c",
	// "0d42bbc8-7f50-4c4d-9fc2-75008682da37",
	// "a8b8910e-3735-4aef-8c3c-de6a895f1b3a",
	// "1b630de3-6433-4c81-98cf-4eabb30686b7",
	// "8db60574-8969-4293-ba72-3b5713da066b",
	// "b81707e9-f714-4f5e-a559-f15991e31ee6",
	// "53859571-baa9-4bee-9d7b-cb093249f426",
	// "fb6bdfbd-5a80-43de-8fae-41b684119814",
	// "369f9099-7107-4501-8ad8-525789394be2",
	// "757089f3-5888-42be-9fcc-45d3d48e25fd", // Day 1

	// Begin page 5 in phpmyadmin
	// "9abf67e5-7c71-4eda-b5fa-78d9f9f8a8b9", // Day 0
	// "beafd82a-1113-4fe0-820b-2168d39ac97a", // Tough Mudder
	// "0c54f91b-ca41-4582-82b2-d800ea3eaca2", // PR


	// TODO, this one causes a js error for some reason
	"b53b0d90-0bd5-4e5d-8537-4b29207bf91", // Christmas
	// "66cfd7b3-901b-4730-ad79-847dd113874e", // 25 bday
	// "03ef4048-10bc-46e0-9404-b4b4e21e8c76", // Resolutions '13
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

	// // Get the comments
	// const commentTree = await getPhotoGalleryComments(uuid);

	// // If it is not empty, add them to the contents
	// if (commentTree.length > 0) {
	// 	const formattedComments = commentsToMarkdown(commentTree);
	// 	contents += `\nComments:\n\n${formattedComments}`;
	// }

	
	if (!existsSync(`${dashedTitle}/index.md`)) {
		writeFileSync(`${dashedTitle}/index.md`, contents, {flag: "w"});
	}
	else {
		console.log("index file already exists. skipping it");
	}
}










// The code below this point was written by duck.ai and is used to extract comments.
// I only intend to keep comments from bike trip blog posts.

async function getPhotoGalleryComments(nodeUuid) {
  const params = new URLSearchParams();

  params.set("filter[entity_id.id]", nodeUuid);
  params.set("include", "uid");

  let nextUrl =
    `https://joshyorndorff.com/jsonapi/comment/comment_node_photo_gallery?${params}`;

  const rawComments = [];
  const includedEntities = [];

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Accept: "application/vnd.api+json"
      }
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}\n` +
        responseText
      );
    }

    const document = JSON.parse(responseText);

    rawComments.push(...(document.data || []));
    includedEntities.push(...(document.included || []));

    nextUrl = document.links?.next?.href || null;
  }

  const usersById = new Map();

  for (const entity of includedEntities) {
    if (entity.type.startsWith("user--")) {
      usersById.set(entity.id, entity);
    }
  }

  const flatComments = rawComments.map(comment => {
    const attributes = comment.attributes || {};
    const authorId = comment.relationships?.uid?.data?.id || null;
    const author = authorId ? usersById.get(authorId) : null;

    const username =
      attributes.name ||
      author?.attributes?.name ||
      null;

    return {
      id: comment.id,
      body: attributes.comment_body?.value || "",
      username,
      parentId: comment.relationships?.pid?.data?.id || null,
      replies: []
    };
  });

  return formatCommentTree(buildCommentTree(flatComments));
}

function buildCommentTree(comments) {
  const commentsById = new Map(
    comments.map(comment => [comment.id, comment])
  );

  const topLevelComments = [];

  for (const comment of comments) {
    if (comment.parentId && commentsById.has(comment.parentId)) {
      const parent = commentsById.get(comment.parentId);
      parent.replies.push(comment);
    } else {
      topLevelComments.push(comment);
    }
  }

  return topLevelComments;
}

function formatCommentTree(comments) {
  return comments.map(comment => {
    const formattedComment = {
      body: comment.body,
      username: comment.username
    };

    if (comment.replies.length > 0) {
      formattedComment.replies = formatCommentTree(comment.replies);
    }

    return formattedComment;
  });
}

function commentsToMarkdown(comments) {
  return comments
    .map(comment => formatComment(comment, 0))
    .join("\n\n");
}

function formatComment(comment, depth) {
  const quotePrefix = ">".repeat(depth + 1);
  const lines = [];

  for (const bodyLine of comment.body.split(/\r?\n/)) {
    lines.push(`${quotePrefix} ${bodyLine}`);
  }

  lines.push(`${quotePrefix} **${comment.username}**`);

  for (const reply of comment.replies || []) {
    lines.push(`${quotePrefix}`);
    lines.push(formatComment(reply, depth + 1));
  }

  return lines.join("\n");
}
