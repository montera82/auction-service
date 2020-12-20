import AWS from 'aws-sdk';
import middleware from '../lib/middleware';
import createError from 'http-errors'
import { getAuctionById } from './getAuction';
import { Forbidden } from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
   
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);
  if ( amount < auction.highestBid.amount) {
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
  }

  if ( auction.status != 'OPEN' ) {
    throw new createError.Forbidden(`You cannot bid on a closed auction`);
  }

  const params = {
    TableName : process.env.AUCTIONS_TABLE_NAME,
    Key: {id},
    UpdateExpression : 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount
    },
    ReturnValues : 'ALL_NEW',
  }

  let updatedAuction;
  try {
    const result = await dynamodb.update(params).promise();

    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middleware(placeBid);



