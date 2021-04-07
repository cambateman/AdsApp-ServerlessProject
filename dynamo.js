const AWS = require("aws-sdk");
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "adsapp";

exports.getPosts = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const posts = await dynamoClient.scan(params).promise();
  return posts.Items.reverse();
};

exports.addPosts = async (post) => {
  const params = {
    TableName: TABLE_NAME,
    Item: post,
  };
  return await dynamoClient.put(params).promise();
};

exports.deletePost = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };
  return await dynamoClient.delete(params).promise();
};
