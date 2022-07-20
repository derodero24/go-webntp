import axios, { AxiosResponse } from 'axios';
import { useEffect, useRef } from 'react';

type Response = {
  id: string;
  it: number; // Initiate Time (Unix Epoch) [second]
  st: number; // Send Time (Unix Epoch) [second]
  leap: number;
  next: number;
  step: number;
};

type Result = {
  delay: number;
  offset: number; // (server time) - (client time) [millisecond]
};

export default function App(): JSX.Element {
  const offset = useRef(0);

  const test = () => {
    const clock = document.getElementById('clock');
    const clock2 = document.getElementById('clock2');
    const remote = Date.now() + offset.current;
    if (clock?.innerText) clock.innerText = new Date(remote).toString();
    if (clock2?.innerText) clock2.innerText = remote.toString();
  };

  useEffect(() => {
    let timer: number;
    const start = performance.now();
    axios({
      url: 'https://56qtfuxaa9.execute-api.ap-northeast-1.amazonaws.com/dev',
      method: 'GET',
    }).then((res: AxiosResponse<Response>) => {
      console.log(res.data);
      const delay = performance.now() - start;
      offset.current = res.data.st * 1000 - Date.now() + delay / 2;
      timer = setInterval(test, 0.1);
    });
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h1 id="clock">Syncing... Please wait.</h1>
      <h1 id="clock2">Syncing... Please wait.</h1>
    </div>
  );
}
