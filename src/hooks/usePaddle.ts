'use client';

import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';

let paddlePromise: Promise<Paddle | undefined> | null = null;

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | undefined>();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    if (!paddlePromise) {
      paddlePromise = initializePaddle({ token });
    }

    paddlePromise.then((instance) => setPaddle(instance));
  }, []);

  return paddle;
}
