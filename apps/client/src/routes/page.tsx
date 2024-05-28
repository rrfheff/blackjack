import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { useNavigate, useSearchParams } from '@modern-js/runtime/router';

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameid');
  const [name, setName] = useState<string>(
    localStorage.getItem('demo-game-21') || '',
  );
  const [ready, setReady] = useState(false);
  return (
    <div className="flex items-center justify-center w-full flex-col">
      <TextField
        className="mt-16"
        label="Your Name"
        variant="outlined"
        value={name}
        onChange={e => {
          setName(e.target.value);
          localStorage.setItem('demo-game-21', e.target.value);
        }}
      />
      <LoadingButton
        className="mt-32"
        variant="contained"
        color="primary"
        loading={ready}
        disabled={!name || ready || !gameId}
        onClick={() => {
          setReady(true);
          window.userName = name;
          const eventSource = new EventSource(
            `http://test.com/poker/ready?gameId=${gameId}&userName=${name}`,
          );
          eventSource.onmessage = function (event) {
            if (event.data === 'ready') {
              navigate(`/game?gameid=${gameId}`);
            }
          };
        }}
      >
        Ready
      </LoadingButton>
    </div>
  );
};

export default Index;
