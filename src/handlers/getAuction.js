import AWS from 'aws-sdk';
import middleware from '../lib/middleware';
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;
  
  try {
    const result = await dynamodb.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key : { id }
    }).promise();

    auction = result.Item;
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError();
  }

  if (!auction) {
    throw new createError.NotFound('Auction with ID not found');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middleware(getAuction);



