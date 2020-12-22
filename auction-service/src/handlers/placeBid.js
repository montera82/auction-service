import AWS from 'aws-sdk';
import middleware from '../lib/middleware';
import createError from 'http-errors'
import { getAuctionById } from './getAuction';
import validator from '@middy/validator';
import placeBidSchema from '../validationSchema/placeBidShema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
   
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;

  const auction = await getAuctionById(id);

  // Cannot Bid on your own auction
  if ( email === auction.seller ){
    throw new createError.Forbidden(`You cannot bid on your own auction!`);
  }

  // Cannot double bid business rule
  if ( email === auction.highestBid.bidder ){
    throw new createError.Forbidden(`You are already the highest bidder!`);
  }

  // Amount can not be less business rule
  if ( amount < auction.highestBid.amount) {
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
  }

  // Status must be open validation
  if ( auction.status != 'OPEN' ) {
    throw new createError.Forbidden(`You cannot bid on a closed auction`);
  }

  const params = {
    TableName : process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression : 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': email,
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

export const handler = middleware(placeBid)
      .use(validator({
        inputSchema: placeBidSchema,
      }));



