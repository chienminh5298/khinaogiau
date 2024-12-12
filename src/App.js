import { useEffect, useMemo, useState } from "react";
import "./App.css";
import axios from "axios";

function convertToVNDCurrency(number) {
    const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(number);
}

function convertToUSDCurrency(number) {
    const formatter = new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(number);
}

const getOpenPrice = async () => {
    const data = await axios.get(`https://api.binance.us/api/v3/klines?symbol=SOLUSDT&interval=1d&limit=1`);
    if (data.status === 200) {
        return parseFloat(data.data[0][1]);
    } else {
        return 0;
    }
};

const App = () => {
    const [currentPrice, setCurrentPrice] = useState(null);
    const [openPrice, setOpenPrice] = useState(0);

    useEffect(() => {
        const symbol = "SOL";
        const stable = "USDT";

        // Price socket
        var webSocketString = "wss://fstream.binance.com/stream?streams=";
        webSocketString += `${symbol.toLocaleLowerCase() + stable.toLocaleLowerCase()}@bookTicker/`;
        webSocketString = webSocketString.slice(0, -1);
        const priceSocket = new WebSocket(webSocketString);
        priceSocket.onopen = () => {};

        let lastUpdateTime = 0; // Store the timestamp of the last update
        priceSocket.onmessage = (msg) => {
            const data = JSON.parse(msg.data).data.b;
            const now = Date.now();

            // Update the state only if 3 seconds have passed
            if (now - lastUpdateTime >= 3000) {
                setCurrentPrice(data);
                lastUpdateTime = now;
            }
        };

        // Candlestick price
        getOpenPrice().then((price) => {
            setOpenPrice(price);
        });

        return () => {
            priceSocket.close();
        };
    }, []);

    const QSOL = 268.3;
    const TSOL = 500;
    const di3SOL = 130.86;
    const chauSOL = 90.97;
    const total = parseInt((QSOL + TSOL) * currentPrice);
    const vndCurrency = 24000;
    const sign = currentPrice - openPrice > 0 ? "+" : "-";
    return (
        <div className="container">
            {currentPrice ? (
                <div>
                    <p>Giá SOL: {currentPrice}</p>
                    <p>Giá $: {convertToVNDCurrency(vndCurrency)}</p>
                    <ul>
                        <li>
                            <p>
                                Quâỵ có {QSOL} SOL tương đương: <strong>{parseInt(QSOL * currentPrice)}</strong>$ `tương đương <strong>{convertToVNDCurrency(QSOL * currentPrice * vndCurrency)}</strong>, hôm nay{" "}
                                <strong>
                                    {sign}
                                    {convertToUSDCurrency((currentPrice - openPrice) * QSOL)}
                                </strong>
                                {" tương đương "}
                                <strong>
                                    {sign}
                                    {convertToVNDCurrency((currentPrice - openPrice) * QSOL * vndCurrency)}
                                </strong>
                            </p>
                        </li>
                        <li>
                            <p>
                                Tiêu có {TSOL} SOL tương đương: <strong>{parseInt(TSOL * currentPrice)}</strong>$ tương đương <strong>{convertToVNDCurrency(TSOL * currentPrice * vndCurrency)}</strong>, hôm nay{" "}
                                <strong>
                                    {sign}
                                    {convertToUSDCurrency((currentPrice - openPrice) * TSOL)}
                                </strong>
                                {" tương đương "}
                                <strong>
                                    {sign}
                                    {convertToVNDCurrency((currentPrice - openPrice) * TSOL * vndCurrency)}
                                </strong>
                            </p>
                        </li>
                    </ul>

                    <p>
                        Tổng 2 thằng có: {(QSOL + TSOL).toFixed(2)} SOL tương đương: <strong>{convertToUSDCurrency(total)}</strong> tương đương <strong>{convertToVNDCurrency(total * vndCurrency)}</strong>, hôm nay{" "}
                        <strong>
                            {sign} {convertToUSDCurrency((currentPrice - openPrice) * (QSOL + TSOL))}
                        </strong>
                        {" tương đương "}
                        <strong>
                            {sign}
                            {convertToVNDCurrency((currentPrice - openPrice) * (QSOL + TSOL) * vndCurrency)}
                        </strong>
                    </p>
                    <ul>
                        <li>
                            <p>
                                Dì 3 có {TSOL} SOL tương đương: <strong>{parseInt(di3SOL * currentPrice)}</strong>$ tương đương <strong>{convertToVNDCurrency(di3SOL * currentPrice * vndCurrency)}</strong>, hôm nay{" "}
                                <strong>
                                    {sign}
                                    {convertToUSDCurrency((currentPrice - openPrice) * di3SOL)}
                                </strong>
                                {" tương đương "}
                                <strong>
                                    {sign}
                                    {convertToVNDCurrency((currentPrice - openPrice) * di3SOL * vndCurrency)}
                                </strong>
                            </p>
                        </li>
                        <li>
                            <p>
                                Châu có {TSOL} SOL tương đương: <strong>{parseInt(chauSOL * currentPrice)}</strong>$ tương đương <strong>{convertToVNDCurrency(chauSOL * currentPrice * vndCurrency)}</strong>, hôm nay{" "}
                                <strong>
                                    {sign}
                                    {convertToUSDCurrency((currentPrice - openPrice) * chauSOL)}
                                </strong>
                                {" tương đương "}
                                <strong>
                                    {sign}
                                    {convertToVNDCurrency((currentPrice - openPrice) * chauSOL * vndCurrency)}
                                </strong>
                            </p>
                        </li>
                    </ul>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default App;
