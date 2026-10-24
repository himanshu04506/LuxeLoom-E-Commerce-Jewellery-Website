import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMetalRates } from '../services/productService';

const MetalRateContext = createContext();

export const MetalRateProvider = ({ children }) => {
  const [rates, setRates] = useState({
    GOLD_24K: { ratePerGram: 7250, source: 'DEFAULT', effectiveDate: new Date() },
    GOLD_22K: { ratePerGram: 6645, source: 'DEFAULT', effectiveDate: new Date() },
    GOLD_18K: { ratePerGram: 5437, source: 'DEFAULT', effectiveDate: new Date() },
    SILVER_925: { ratePerGram: 88, source: 'DEFAULT', effectiveDate: new Date() },
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      const data = await getMetalRates();
      if (data.success && data.rates) {
        setRates(data.rates);
        setLastUpdated(new Date(data.timestamp || Date.now()));
      }
    } catch (err) {
      console.warn('Using default metal rates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <MetalRateContext.Provider value={{ rates, lastUpdated, fetchRates, loading }}>
      {children}
    </MetalRateContext.Provider>
  );
};

export const useMetalRates = () => useContext(MetalRateContext);
