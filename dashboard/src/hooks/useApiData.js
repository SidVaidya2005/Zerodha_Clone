import { useState, useEffect, useRef } from "react";
import axios from "axios";

export function useApiData(url, errorMsg, refreshIntervalMs = 0) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isFirstFetch = useRef(true);

  useEffect(() => {
    isFirstFetch.current = true;
    const controller = new AbortController();

    async function fetchData() {
      if (isFirstFetch.current) setIsLoading(true);
      setError("");
      try {
        const res = await axios.get(url, { signal: controller.signal });
        setData(res.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(errorMsg, err);
        setError(errorMsg);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          isFirstFetch.current = false;
        }
      }
    }

    fetchData();

    if (refreshIntervalMs > 0) {
      const intervalId = setInterval(fetchData, refreshIntervalMs);
      return () => {
        controller.abort();
        clearInterval(intervalId);
      };
    }
    return () => controller.abort();
  }, [url, refreshIntervalMs]);

  return { data, isLoading, error };
}
