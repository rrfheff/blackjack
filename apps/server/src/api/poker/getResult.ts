import { getResult } from '@server/utils';
import type { RequestHandler } from 'express';

export const get = (async (req, res, next) => {
  const { gameId } = req.query;
  try {
    const { gameEndState, getRankList } = getResult(gameId);
    if (gameEndState) {
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
      });
      res.flushHeaders();
      gameEndState.promise.then(() => {
        res.write(`data: ${JSON.stringify(getRankList())}\n\n`);
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
  }
>;
