import { useState, useEffect } from "react";
import axios from "axios";

export function useApiData(url, errorMsg, refreshIntervalMs = 0) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError("");
      try {
        const res = await axios.get(url);
        setData(res.data);
      } catch (err) {
        console.error(errorMsg, err);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    if (refreshIntervalMs > 0) {
      const intervalId = setInterval(fetchData, refreshIntervalMs);
      return () => clearInterval(intervalId);
    }
  }, [url, refreshIntervalMs]);

  return { data, isLoading, error };
}
