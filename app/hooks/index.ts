import { useEffect, useState } from "react";
import { useFetcher } from "remix";
//import type { ClientQuestion } from '~/routes/trivia/$slug/play';

export function usePolling<T>(
  url = "",
  initialData: T,
  frequency = 500,
  pause = false
): T {
  const fetcher = useFetcher();
  const [data, setData] = useState<T>(initialData);
  useEffect(() => {
    const interval = setInterval(async () => {
      if (fetcher.state === "idle" && !pause) {
        await fetcher.load(url);
        if (fetcher.data) {
          setData(fetcher.data as T);
        }
      }
    }, frequency);
    return () => {
      clearTimeout(interval);
    };
  }, [url, fetcher, frequency, pause]);

  return data;
}
