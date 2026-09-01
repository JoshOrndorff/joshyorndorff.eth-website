const BASE_URL = "https://joshyorndorff.com";

const uuids = [
    "fd17292e-e186-4042-9a9a-19ca06fc445d", // NID 1270, Day 42
	"98d5ad97-9924-4fb3-919a-bf1762b2c4ec",
	"7e3dbc56-1eb4-46d0-92ce-c4777b0f00c0",
	"c6b23ddd-75fd-435b-b429-75823f08702d",
	"771d5ea8-8454-4032-ae6a-ac71583aa50d",
	"c5b0b302-13c8-4a9b-8ca8-a58a3d2e8ba1",
	"9ec31ddc-d9c7-4db0-b3c5-e67c4a6e6c78",
	"ea2df73d-046d-42c7-ad1c-18607eae05ac",
	"a247aea7-cd43-484a-bd51-9b59193418ab",
	"7493f0ad-ff98-4b63-8680-c8d7b8e44482",
	"1e9907ba-1fb8-44c0-acac-1918f8a80d03",
	"3b9b9a95-a138-48fd-8a65-99b537e47b3f",
	"753e3602-e4bb-4fa9-b05f-d63370dfd087",
	"06c7a522-49ae-4d77-82c3-7dc764c4fd21",
	"37545a2c-7da8-4df1-8eb1-04f9aab7a106",
	"0e972538-680f-4245-8020-f6bab96d51dc",
	"7753f89c-f28c-41e9-953e-92a5d0b8f31c", // Day 26


];

async function getPhotoGalleryComments(nodeUuid) {
  const params = new URLSearchParams();

  params.set("filter[entity_id.id]", nodeUuid);
  params.set("include", "uid");

  let nextUrl =
    `${BASE_URL}/jsonapi/comment/comment_node_photo_gallery?${params}`;

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

for (uuid of uuids) {
    getPhotoGalleryComments(uuid)
    .then(commentTree => {
        console.log("===========================");
        console.log(commentsToMarkdown(commentTree));
    })
    .catch(error => {
        console.log("===========================");
        console.error("Could not retrieve comments:", error);
    });
}

