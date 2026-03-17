import { useState, useEffect } from "react";
import axios from "axios";

export function useApiData(url, errorMsg) {
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
  }, [url]);

  return { data, isLoading, error };
}
