import AWS from 'aws-sdk';
import middleware from '../lib/middleware';
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {

  let auction;
  try {
    const result = await dynamodb.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key : { id }
    }).promise();
    auction = result.Item;

  } catch (error) {
    console.error(error)
    console.log(1);
    throw new createError.InternalServerError(error);
    console.log(2);
  }

  if (!auction) {
    throw new createError.NotFound('Auction with ID not found');
  };

  return auction;
}

async function getAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;
  
  auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middleware(getAuction);



