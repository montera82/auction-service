
async function index(event, context) {

  return {
    statusCode: 200,
    body: JSON.stringify({'message': 'Welcome to the Auction Service api v.1.0.0'}),
  };
}

export const handler = index;