import { useEffect, useRef } from 'react'

export const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const lerp = (a, b, t) => ((1 - t) * a + t * b);
