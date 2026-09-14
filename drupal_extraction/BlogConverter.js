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
// * Comments for bike trip posts only
//
// The script grabs blogs based on their uuid. You can get them using PHPMYADMIN and 
// exploring the node table. Specifically, this SQL Query:
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
	// "b53b0d90-0bd5-4e5d-8537-4b29207bf91b", // NID 1098, Christmas 2012
	// "66cfd7b3-901b-4730-ad79-847dd113874e", // 25 bday
	// "226fc7f9-aa95-448a-9d98-561eb3048ac3", // Resolutions '13

	// 2012
	// "03ef4048-10bc-46e0-9404-b4b4e21e8c76", // Whiteboard drawings
	// "579c3e73-0948-4dc7-82f3-ac200f9f54c7", // Iron Dragon

	// "226fc7f9-aa95-448a-9d98-561eb3048ac3", // Resolutions '13 again. I guess it got edited at some point.
	// "d93058e9-96af-4d53-b097-2048fd4818e7",
	// "3028a751-2282-4285-9dc2-24e465b3a220",
	// "57997078-1116-4992-bfce-efaf2c40062d",
	// "cb50079f-ede3-4062-a2fc-64a458ea11a2",
	// "f207ff6e-cba9-4af8-9665-78ee8d04ec50",
	// "3deaf1e8-2e68-49e1-be91-2a119746f846",
	// "d041e086-c25e-4bfd-bfc6-0ee027e333da",
	// "55ff0cff-5446-4ae7-b2df-1c347f9cc7bb",
	// "23633d30-2ef1-4b30-84e7-416e94165aeb",

	// "7128a81e-b8a2-4045-8794-19fde143e689",
	// "8b1364e5-7a97-4ec4-8ee9-746075e147d7",
	// "b460dce6-52b4-4019-bbee-065f1896ec8e",
	// "9ab17200-5180-4cfd-8830-cdb846169356",
	// "9d05eab6-7eff-4ed5-80d4-44ad6e5e4304",

	// "b6a7c8b7-770c-44ab-81a3-9728cd871f85", // Party
	// "9955c2ab-5481-4ac9-b7d6-dd148b0099d2", // Miami
	// "b7f22334-e273-4983-98bc-a372cea13cab", // Unpublished Draft: We didn't start the fire. Not yet imported.

	// Begin PhpMyAdmin Page 6
	// "40b52fca-1adc-4f26-81e3-f366516593e7", // Warrior dash 2011
	// "af037b90-1437-4b66-ac6e-b1dbd89bfcae", // Creating arrays on fly
	// "301fc272-39ba-47b9-b94e-fcdcf6fab701",
	// "e4d7e87e-a36e-479a-b46c-4422ee507927",
	// "7fea2cb1-c00f-4386-a27c-55b51f51a9b5", // Resolutions 2011
	// "45b84191-285d-4e63-979f-5a843f6ab2b1", // Facebook import: backup plans
	// "7fe7e1b7-1268-4e10-a799-22df484a4f3c",
	// "a6078f62-8720-47dd-997b-c73b6054ea3e",
	// "b000bc76-4ae0-4187-ae45-de6094edfadc",
	// "4e788094-3a23-4dbe-8644-8acf42c40c86",
	// "9abf7f75-9499-42d5-89d0-813feab4c27c",
	// "0109147e-145a-40d4-a63d-f9ef47434d5a",
	// "b5c2efe2-b1eb-4ee5-8760-c68ce73cdd33",
	// "5dd815f5-c77e-4b60-ab5f-67f20933e5af",
	// "79a5d6ca-a8e3-440f-9a6b-1b1892519c49",
	// "12eb1f51-067f-4644-96c4-aafb3f4ebe61",
	// "64c7b2d3-84c0-4d67-b394-a4100bdeb0b1",
	// "91b9aab4-c12c-442c-afe1-10c2a597f1d1",
	// "3c363411-1c74-4672-b737-d9c0e24fbfb1",
	// "39f7a60a-f022-4ed5-b4c5-1e5e4f7047ec",
	// "aac0749b-3fa8-4e37-98a8-76ce79877461", // Roadtrip to california
	// "fef41dd1-15ad-4d1e-a268-1229b9ad610a", // Michigan Bicycle Trip

	// China Era
	// "dea92c16-4978-4b2e-bd78-491c30992112", // Pearl River Cruise
	// "d93f73f9-a15b-411c-8b00-4c7e9c066663", // Dragon Boats
	// "8e6ae9ac-3060-4d76-9d5b-2e280d4b8dad", // Opera House

	// Begin page 7 of PhpMyAdmin
	// "2ff1ed2a-8e31-4d62-8fe0-e44b0e76a984", // Jazz Show
	// "137d7016-447d-4dcb-8f4f-5933ce1ab891", // todo in America
	// "61ba91cd-e8b0-4560-b3fc-8e5106d93c5b", // GD Museum
	// "9ceed4f9-0005-4cf6-a5d0-63c4e9277077", // Baiyun Mountain
	// "91e0245b-8bed-4c67-9cef-1556e41e9b84", // HuangPu Port
	// "7dfe1c7b-66ef-4f0d-a9df-1375d57d0e39", // Sunny and Me
	// "95b044c7-2a89-458f-8101-391199a58d9d", // Hong Kong Trip
	// "2a2ce686-5d30-4b77-9b25-776e493bc7d6", // Another Walking trip
	// "d078ce8c-4d8c-4ff0-b62e-1a2ef325db98", // Tianhe Park Brian
	// "7eefe011-7d04-460e-b457-56ffbe482096", // nid39 5 goat statue
	// "a74b89bf-a431-4289-8835-c0ccdd613628", // nid34 Tianhou Palace Jasmine
	
	"da79ee46-7c01-4a3c-84cf-745411283a68", // nid28 Shamian Island
	"5bb8e36d-7d56-46e1-846f-d3e97b3832eb", // nid27 Grandview Mall
	"c4301e94-bf89-478e-8698-5b9c83a82e43", // nid22 Jeff's Birthday
	"fc77b7d5-f134-4ca1-a3ec-5f5ee89c545d", // nid19 Alex and the Airplanes
	// "7ce82ad6-347d-4702-9111-2adc8ce11323", // nid16 Engrish
	// "68f7d9ad-c59c-486c-ba8b-b1b38edc84ee", // nid14 Beijing Road
	// "794868bb-1688-4c8d-9a31-166386a8157f", // nid13 First night in China
	// "70caf6f2-99cb-4305-a520-3b058e5b9298", // nid12 School
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
