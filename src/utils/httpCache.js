import crypto from 'node:crypto';

const createEtag = (payload) =>
  `W/"${crypto.createHash('sha1').update(JSON.stringify(payload)).digest('base64url')}"`;

const isNotModifiedSince = (ifModifiedSince, lastModified) => {
  if (!ifModifiedSince || !lastModified) {
    return false;
  }

  const modifiedDate = new Date(lastModified).getTime();
  const comparisonDate = new Date(ifModifiedSince).getTime();

  return Number.isFinite(modifiedDate) && Number.isFinite(comparisonDate) && modifiedDate <= comparisonDate;
};

export const applyConditionalGet = (req, res, payload, lastModified) => {
  const etag = createEtag(payload);
  res.setHeader('ETag', etag);

  if (lastModified) {
    res.setHeader('Last-Modified', new Date(lastModified).toUTCString());
  }

  if (req.headers['if-none-match'] === etag || isNotModifiedSince(req.headers['if-modified-since'], lastModified)) {
    res.status(304).end();
    return true;
  }

  return false;
};

