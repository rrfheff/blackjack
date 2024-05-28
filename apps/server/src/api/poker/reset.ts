import { reset } from '@server/utils';
import type { RequestHandler } from 'express';

export const post = (async (req, res, next) => {
  try {
    reset();
    res.send({
      data: true,
    });
  } catch (e: any) {
    next(e);
  }
}) as RequestHandler<
  Record<string, any>,
  {
    data: boolean;
  },
  any,
  {
    id: string;
  }
>;
