import { useState, useEffect } from 'react';
import axios from 'axios';

export const useApi = (url, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const postData = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.post(url, payload);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const putData = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.put(url, payload);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(url);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    post: postData,
    put: putData,
    delete: deleteData,
  };
};