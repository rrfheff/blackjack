import { Poker } from '@server/types';
import { getGame } from '@server/utils';
import type { RequestHandler } from 'express';

export const get = (async (req, res, next) => {
  const { gameId, userName } = req.query;
  try {
    const { getPoker } = getGame(gameId, userName);
    res.send({
      data: getPoker(),
    });
  } catch (e: any) {
    next(e);
  }
}) as RequestHandler<
  Record<string, any>,
  {
    data: Poker | null;
  },
  any,
  {
    gameId: string;
    userName: string;
  }
>;
