import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import crypto from 'crypto';
import { expressjwt } from 'express-jwt';

const app: Express = express();
const port = 3000;

app.use(helmet());
app.use(
  expressjwt({
    secret:
      process.env.JWT_SECRET ||
      'here should be rather an error that env is undefined, but let then at least the default secret be super long',
    algorithms: ['HS256'],
  }),
);
app.get('/sample/echo/:sampleParam', async (req: Request, res: Response) => {
  const { sampleParam } = req.params;
  const { sampleQuery } = req.query;

  // No time to have fun with JSON schema and validation stuff. Go dirty
  const alphanumericRegex = /^[0-9a-z]+$/i;
  if (!alphanumericRegex.test(sampleParam) || !alphanumericRegex.test((sampleQuery || '').toString())) {
    return res.json({
      statusCode: 400,
    });
  }

  const requestHeaders = () => {
    const apiKey = process.env.SAMPLE_ECHO_REQUEST_API_KEY;
    if (typeof apiKey === 'undefined') {
      throw new Error('Sample echo API key is not defined');
    }
    const apiTimestamp = Math.floor(Date.now() / 1000);
    const apiToken = crypto
      .createHash('sha1')
      .update(`${apiKey}${apiTimestamp}${process.env.SAMPLE_ECHO_REQUEST_API_SECRET}`)
      .digest('hex');

    return {
      'X-Api-Key': apiKey,
      'X-Api-Timestamp': apiTimestamp.toString(),
      'X-Api-Token': apiToken,
      'X-Api-Version': '1',
    };
  };

  const url = `${process.env.SAMPLE_ECHO_REQUEST_URL}?param=${sampleParam}&query=${sampleQuery}`;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - fetch in Node 18 is still experimental
  const response = await fetch(url, {
    method: 'GET',
    headers: requestHeaders(),
  });

  if (response.ok) {
    return res.json({
      statusCode: 200,
      echo: await response.json(),
    });
  }

  if (response.status === 404) {
    return res.json({
      statusCode: 404,
      echo: {},
    });
  }

  throw new Error(`Get error code: ${response.status}, message: '${response.json || ''}'`);
});

app.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at port ${port}`);
});
