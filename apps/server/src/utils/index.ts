import { Deferred } from './deferred';

type PokerType = 1 | 2 | 3 | 4;
export type Poker = {
  number: number;
  type: PokerType;
};

export const generateAllPokers = () => {
  const pokers: Poker[] = [];
  for (let i = 1; i <= 13; i++) {
    for (let j = 1; j <= 4; j++) {
      pokers.push({ number: i, type: j as PokerType });
    }
  }
  return shuffle(pokers);
};

export const shuffle = (arr: Poker[]) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getRamdomNumber = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

const stateStore = new Map<
  string,
  {
    scoreStore: Map<string, number>;
    endStateStore: Map<string, boolean>;
  }
>();
// const scoreStore = new Map<string, number>();
// const endStateStore = new Map<string, boolean>();
const gameStartStateStore = new Map<string, Deferred<boolean>>();
const gameEndStateStore = new Map<string, Deferred<boolean>>();
const pokerPond = new Map<string, Poker[]>();
export const getGame = (key: string, userName: string) => {
  const store = stateStore.get(key);
  console.log(stateStore);
  if (!store) {
    throw new Error('Game not found');
  }
  const { scoreStore, endStateStore } = store;
  if (!scoreStore.has(userName)) {
    scoreStore.set(userName, 0);
  }
  let pokers: Poker[] = [];
  if (pokerPond.has(key)) {
    pokers = pokerPond.get(key)!;
  } else {
    pokers = generateAllPokers();
    pokerPond.set(key, pokers);
  }

  return {
    getPokers: () => pokers,
    getPoker: () => {
      const index = getRamdomNumber(pokers.length - 1);
      const poker = pokers.splice(index, 1)[0];
      const score = scoreStore.get(userName)! + poker.number;
      scoreStore.set(userName, score);
      if (score > 21) {
        endStateStore.set(userName, true);
      }
      return poker;
    },
    shuffle: () => {
      pokers = shuffle(pokers);
      pokerPond.set(key, pokers);
    },
  };
};

export const reset = () => {
  pokerPond.clear();
};

export const ready = (key: string, userName: string) => {
  if (!gameStartStateStore.has(key)) {
    gameStartStateStore.set(key, new Deferred());
  }
  if (!stateStore.has(key)) {
    stateStore.set(key, {
      scoreStore: new Map(),
      endStateStore: new Map(),
    });
  }

  if (gameStartStateStore.get(key)?.settled) {
    return false;
  }
  stateStore.get(key)!.endStateStore.set(userName, false);
  return gameStartStateStore.get(key)!;
};

export const start = (key: string) => {
  gameStartStateStore.get(key)?.resolve!(true);
};

export const finish = (key: string, userName: string) => {
  if (!gameEndStateStore.has(key)) {
    gameEndStateStore.set(key, new Deferred());
  }
  const store = stateStore.get(key);
  if (!store) {
    throw new Error('Game not found');
  }
  const { endStateStore } = store;
  endStateStore.set(userName, true);
  const gameEndState = gameEndStateStore.get(key)!;
  if (Array.from(endStateStore.values()).every(Boolean)) {
    gameEndState.resolve!(true);
  }
  return gameEndState;
};

export const getRanking = (key: string, userName: string) => {
  const store = stateStore.get(key);
  if (!store) {
    throw new Error('Game not found');
  }
  const { scoreStore } = store;
  const score = scoreStore.get(userName);
  if (score === undefined) {
    return -1;
  }
  return (
    Array.from(scoreStore.values())
      .filter(s => s <= 21)
      .sort((a, b) => b - a)
      .concat(
        Array.from(scoreStore.values())
          .filter(s => s > 21)
          .sort((a, b) => a - b),
      )
      .indexOf(score) + 1
  );
};

export const getResult = (key: string) => {
  if (!gameEndStateStore.has(key)) {
    gameEndStateStore.set(key, new Deferred());
  }
  const store = stateStore.get(key);
  if (!store) {
    throw new Error('Game not found');
  }
  const { scoreStore } = store;
  const gameEndState = gameEndStateStore.get(key)!;
  return {
    gameEndState,
    getRankList: () => Array.from(scoreStore.entries()),
  };
};
