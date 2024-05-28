import { Button, TextField } from '@mui/material';
import { useState, Fragment } from 'react';

const Index = () => {
  const [id, setId] = useState<string>('');
  const [rankList, setRankList] = useState<[string, number][]>([]);
  return (
    <div className="flex items-center justify-center w-full flex-col">
      {rankList.length > 0 ? (
        <div className="grid grid-cols-2 text-xl">
          <div className="mr-24">name</div>
          <div>score</div>
          {rankList.map(i => (
            <Fragment key={i[0]}>
              <div>{i[0]}</div>
              <div>{i[1]}</div>
            </Fragment>
          ))}
        </div>
      ) : (
        <TextField
          label="Game Id"
          variant="outlined"
          value={id}
          onChange={e => setId(e.target.value)}
        />
      )}
      <Button
        className="mt-32"
        variant="contained"
        color="primary"
        onClick={() => {
          fetch(`http://test.com/poker/start?gameId=${id}`);
          setTimeout(() => {
            const eventSource = new EventSource(
              `http://test.com/poker/getResult?gameId=${id}`,
            );
            eventSource.onmessage = function (event) {
              setRankList(JSON.parse(event.data));
            };
          }, 500);
        }}
      >
        Start
      </Button>
    </div>
  );
};

export default Index;
