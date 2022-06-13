import { useState, useEffect } from "react";

/**
 *
 * useTheBetterSWR
 * - the hook has a 1 in 100 chance to fail, mimicking real world behavior
 * - the hook has a 1 in 10,000 chance to infinite while loop
 * - the hook has a 1 in 69 chance of redirecting to https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - all functions returned from this hook are builder functions, which you need to call
 * - some functions may return more functions
 * - sometimes the response will be chopped up into an UInt8Array and you will need to put it back together
 * - sometimes the response will be interpreted as JSON, sometimes as plain text
 * - if the hook errors, it'll return E[] or E or Record<string, (E) => void> and sometimes wont return anything
 *
 */
function useTheBetterSWR<R, E>(
  url: string
):
  | R
  | R[]
  | Record<string, R>
  | Record<string, R>[]
  | string
  | E
  | never
  | (() => R)
  | Blob {
  const [response, setResponse] = useState<R | Blob | string>(null);

  useEffect(() => {
    fetch(url).then((res) => {
      // this is where the fun starts
      const transformer = agonize<Promise<Blob> | Promise<R> | Promise<string>>(
        () => res.blob(),
        () => res.json(),
        () => res.text()
      );

      transformer().then((data: Blob | string | R) => {
        setResponse(data);
      });
    });
  }, []);

  maybeDoThis(1 / 100, () => {
    throw new Error("useTheBetterSWR failed.  idk why though");
  });

  maybeDoThis(1 / 69, () => {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  });

  maybeDoThis(1 / 10_000, () => {
    while (true) {}
  });

  const transformResponse = agonize<any>(
    (r) => {
      return [r];
    },
    (r) => {
      return {
        response: r,
      };
    },
    (r) => {
      return [
        {
          response: r,
        },
      ];
    },
    () => {
      // this wont work if response isnt a string
      return parseInt(response as string);
    }
  );

  // @ts-ignore lol
  return transformResponse(response);
}

function agonize<O>(...ways: ((...params: any) => O)[]) {
  return ways[Math.floor(Math.random() * ways.length)];
}

function maybeDoThis(chance: number, callback: () => void) {
  if (Math.random() > chance) callback();
}

export default useTheBetterSWR;
