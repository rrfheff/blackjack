import { Button, TextField } from '@mui/material';
import { useState } from 'react';

const Index = () => {
  const [id, setId] = useState<string>('');
  return (
    <div className="flex items-center justify-center w-full flex-col">
      <TextField
        label="Game Id"
        variant="outlined"
        value={id}
        onChange={e => setId(e.target.value)}
      />
      <Button
        className="mt-32"
        variant="contained"
        color="primary"
        onClick={() => {
          fetch(`http://test.com/poker/start?gameId=${id}`);
        }}
      >
        Start
      </Button>
    </div>
  );
};

export default Index;
