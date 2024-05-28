import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from '@modern-js/runtime/router';

type Poker = {
  number: number;
  type: number;
};

const getNumber = (number: number) => {
  switch (number) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return number;
  }
};

const Card = ({ number, type }: Poker) => {
  return (
    <div className="p-24 border-solid border border-zinc-300 rounded-lg w-100">
      <div className="text-4xl">
        {getNumber(number)}
        {type === 1 && '♠️'}
        {type === 2 && '♥️'}
        {type === 3 && '♣️'}
        {type === 4 && '♦️'}
      </div>
    </div>
  );
};

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [rank, setRank] = useState(0);
  const [pokerList, setPokerList] = useState<Poker[]>([]);
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameid');
  const score = pokerList.reduce((acc, cur) => acc + cur.number, 0);
  const over = score > 21;
  const onFinish = () => {
    setDone(true);
    const eventSource = new EventSource(
      `http://test.com/poker/finish?gameId=${gameId}&userName=${window.userName}`,
    );
    eventSource.onmessage = function (event) {
      setRank(parseInt(event.data, 10));
    };
  };
  useEffect(() => {
    if (over) {
      onFinish();
    }
  }, [over]);
  return (
    <div className="flex items-center justify-center w-full h-full flex-col">
      <div
        className="grid gap-12"
        style={{
          maxWidth: '500px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        }}
      >
        {pokerList.map((poker, index) => (
          <Card key={index} {...poker} />
        ))}
      </div>
      {over && <div className="mt-24 text-lg text-red-700">Bust!</div>}
      <div className="mt-24 text-lg">Score: {score}</div>
      {rank && <div className="mt-24 text-lg">Rank: {rank}</div>}
      <Button
        className="mt-32"
        variant="contained"
        color="primary"
        disabled={loading || over || done}
        onClick={() => {
          setLoading(true);
          fetch(
            `http://test.com/poker/get?gameId=${gameId}&userName=${window.userName}`,
          )
            .then(r => r.json())
            .then(r => {
              setLoading(false);
              setPokerList(pokerList.concat(r.data));
            })
            .catch(() => {
              setLoading(false);
            });
        }}
      >
        {pokerList.length === 0 ? 'Get' : 'Add'} Card
      </Button>
      <Button
        className="mt-32"
        variant="contained"
        color="primary"
        disabled={loading || over}
        onClick={onFinish}
      >
        Finish
      </Button>
    </div>
  );
};

export default Index;
