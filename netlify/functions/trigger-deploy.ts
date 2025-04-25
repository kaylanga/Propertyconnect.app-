import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Verify webhook secret
  const webhookSecret = process.env.DEPLOY_WEBHOOK_SECRET;
  const providedSecret = event.headers['x-webhook-secret'];

  if (providedSecret !== webhookSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  // Trigger build
  try {
    const response = await fetch(process.env.NETLIFY_BUILD_HOOK!, {
      method: 'POST',
    });

    if (!response.ok) throw new Error('Failed to trigger build');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Build triggered successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to trigger build' }),
    };
  }
}; 