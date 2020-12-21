import AWS from 'aws-sdk';
import middleware from '../lib/middleware';
import createError from 'http-errors'
import getAuctionsSchema from '../validationSchema/getAuctionsSchema';
import validator from '@middy/validator'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctionByStatus(status) {
    const params = {
      TableName : process.env.AUCTIONS_TABLE_NAME,
      IndexName : 'StatusAndEndDate',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeValues: {
        ':status': status,
      },
      ExpressionAttributeNames: {
        '#status': 'status'
      }
    }
    const results = await dynamodb.query(params).promise();
    return results.Items;
};

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;
  
  try {
    auctions = await getAuctionByStatus(status);
  } catch (error) {
    console.error(console.error());
    throw new createError.InternalServerError(console.error());
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middleware(getAuctions)
  .use(validator({
    inputSchema: getAuctionsSchema,
    useDefaults: true,
  }));



