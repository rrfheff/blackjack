import { finish, getRanking } from '@server/utils';
import type { RequestHandler } from 'express';

export const get = (async (req, res, next) => {
  const { gameId, userName } = req.query;
  try {
    const state = finish(gameId, userName);
    if (state) {
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
      });
      res.flushHeaders();
      state.promise.then(() => {
        res.write(`data: ${getRanking(gameId, userName)}\n\n`);
      });
    } else {
      res.status(400).send(false);
    }
  } catch (e: any) {
    next(e);
  }
}) as RequestHandler<
  Record<string, any>,
  boolean,
  any,
  {
    gameId: string;
    userName: string;
  }
>;
