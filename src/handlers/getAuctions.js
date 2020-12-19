import AWS from 'aws-sdk';
import middleware from '../lib/middleware';
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;
  
  try {
    const results = await dynamodb.scan({
      TableName: process.env.AUCTIONS_TABLE_NAME
    }).promise();

    auctions = results.Items;
  } catch (error) {
    console.error(console.error());
    throw new createError.InternalServerError(console.error());
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middleware(getAuctions);



