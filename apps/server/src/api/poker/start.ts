import { start } from '@server/utils';
import type { RequestHandler } from 'express';

export const get = (async (req, res, next) => {
  const { gameId } = req.query;
  try {
    start(gameId);
    res.send(true);
  } catch (e: any) {
    next(e);
  }
}) as RequestHandler<
  Record<string, any>,
  boolean,
  any,
  {
    gameId: string;
  }
>;
