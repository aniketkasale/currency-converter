import ExchangeSVG from "@/assets/exchangeSVG";
import { get } from "@/services/axiosClient";
import { useEffect, useState } from "react";
const API_KEY = "fca_live_xAgIeCSrcLpcBQHSq7PlgLjJPaoRaQK4uFa7LEDR";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1000.0);
  const [convertedAmount, setConvertedAmount] = useState(736.7);
  const [exchangeRate, setExchangeRate] = useState(0.7367);
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("SGD");
  const [toCurrency, setToCurrency] = useState("USD");

  const convertCurrency = async (fromCurrency, toCurrency, amount = amount) => {
    try {
      const response = await get("latest", {
        apikey: API_KEY,
        base_currency: fromCurrency,
        currencies: toCurrency,
      });

      const rates = response.data.data;
      const conversionRate = rates[toCurrency];
      const convertedAmount = (amount * conversionRate).toFixed(2);

      return {
        rate: conversionRate,
        convertedAmount: convertedAmount,
      };
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      throw error;
    }
  };

  const handleAmountChange = async (e) => {
    const newAmount = e?.target?.value || e;
    setAmount(newAmount);
    try {
      const { rate, convertedAmount } = await convertCurrency(
        fromCurrency,
        toCurrency,
        newAmount
      );
      setExchangeRate(rate);
      setConvertedAmount(convertedAmount);
    } catch (error) {
      console.error("Error during currency conversion:", error);
    }
  };

  const getCurrencies = async () => {
    try {
      const response = await get(`currencies`, {
        apikey: API_KEY,
      });
      setCurrencies(response.data.data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      throw error;
    }
  };

  const handleSwapCurrencies = async () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    try {
      const { rate, convertedAmount } = await convertCurrency(
        toCurrency,
        tempCurrency,
        convertedAmount
      );
      setExchangeRate(rate);
      setAmount(convertedAmount);
      setConvertedAmount((convertedAmount * rate).toFixed(2));
    } catch (error) {
      console.error("Error during currency swap conversion:", error);
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  useEffect(() => {
    handleAmountChange(amount);
  }, [fromCurrency, toCurrency]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">
        Currency Converter
      </h1>
      <p className="text-gray-500 text-sm mb-4">
        Check live rates, set rate alerts, receive notifications and more.
      </p>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <p className="text-gray-500 text-sm">Amount</p>
        <div className="flex items-center mb-4">
          <div className="flex items-center w-1/2">
            <select
              className="bg-transparent text-blue-900 font-semibold"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {Object.keys(currencies || {}).map((currency) => {
                return (
                  <option key={currency} value={currencies[currency].code}>
                    {currencies[currency].code}
                  </option>
                );
              })}
            </select>
          </div>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="bg-gray-100 text-right text-gray-700 font-semibold w-full p-2 rounded-md"
          />
        </div>

        <div className="flex justify-center items-center my-4">
          <button
            className="text-white bg-blue-600 p-2 rounded-full"
            onClick={handleSwapCurrencies}
          >
            <ExchangeSVG />
          </button>
        </div>
        <p className="text-gray-500 text-sm">Converted Amount</p>
        <div className="flex items-center mb-4">
          <div className="flex items-center w-1/2">
            <select
              className="bg-transparent text-blue-900 font-semibold"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {Object.keys(currencies || {}).map((currency) => {
                return (
                  <option key={currency} value={currencies[currency].code}>
                    {currencies[currency].code}
                  </option>
                );
              })}
            </select>
          </div>
          <input
            type="number"
            value={convertedAmount}
            readOnly
            className="bg-gray-100 text-right text-gray-700 font-semibold w-full p-2 rounded-md"
          />
        </div>
      </div>

      <p className="text-gray-500 text-left mt-4 ">
        Indicative Exchange Rate
        <br />
        <span className="font-semibold text-black">{`1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`}</span>
      </p>
    </div>
  );
}
