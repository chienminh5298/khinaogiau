import { useEffect, useState } from "react";
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

const getOpenPrice = async (symbol) => {
    const data = await axios.get(`https://api.binance.us/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=1`);
    if (data.status === 200) {
        return parseFloat(data.data[0][1]);
    } else {
        return 0;
    }
};

const App = () => {
    const [currentPrice, setCurrentPrice] = useState({
        XRP: 0,
        SOL: 0,
    });
    const [openPrice, setOpenPrice] = useState({
        XRP: 0,
        SOL: 0,
    });

    useEffect(() => {
        const symbol = ["SOL", "XRP"];
        const stable = "USDT";
        const socketPrice = [];
        // Price socket
        symbol.forEach((s) => {
            let webSocketString = "wss://fstream.binance.com/stream?streams=";
            webSocketString += `${s.toLocaleLowerCase() + stable.toLocaleLowerCase()}@bookTicker/`;
            webSocketString = webSocketString.slice(0, -1);
            const priceSocket = new WebSocket(webSocketString);
            priceSocket.onopen = () => {};

            let lastUpdateTime = 0; // Store the timestamp of the last update
            priceSocket.onmessage = (msg) => {
                const data = JSON.parse(msg.data).data.b;
                const now = Date.now();

                // Update the state only if 3 seconds have passed
                if (now - lastUpdateTime >= 3000) {
                    setCurrentPrice((prevState) => ({
                        ...prevState,
                        [s]: data,
                    }));
                    lastUpdateTime = now;
                }
            };
            socketPrice.push(priceSocket);

            // Candlestick price
            getOpenPrice(s).then((price) => {
                setOpenPrice((prevState) => ({
                    ...prevState,
                    [s]: price,
                }));
            });
        });

        return () => {
            socketPrice.forEach((soc) => soc.close());
        };
    }, []);

    const QSOL = 269.6;
    const TSOL = 318.125;
    const TXRP = 13528;
    const XRPdautu = 4943;
    const di3SOL = 100;
    const chauSOL = 125.79;
    const chauXRP = 1613;
    const vndCurrency = 24500;
    return (
        <div className="container">
            <div>
                <p>SOL: {currentPrice.SOL}</p>
                <p>XRP: {currentPrice.XRP}</p>
                <p>Giá $: {convertToVNDCurrency(vndCurrency)}</p>
                <ul>
                    <li>---------------------------------------------------------------</li>
                    <li>
                        <p>
                            Quâỵ có {QSOL} SOL tương đương: <strong>{parseInt(QSOL * currentPrice.SOL)}</strong>$ `tương đương <strong>{convertToVNDCurrency(QSOL * currentPrice.SOL * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.SOL - openPrice.SOL) * QSOL)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency((currentPrice.SOL - openPrice.SOL) * QSOL * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>---------------------------------------------------------------</li>
                    <li>
                        <p>
                            Tiêu có {TSOL} SOL tương đương: <strong>{parseInt(TSOL * currentPrice.SOL)}</strong>$ tương đương <strong>{convertToVNDCurrency(TSOL * currentPrice.SOL * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.SOL - openPrice.SOL) * TSOL)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency((currentPrice.SOL - openPrice.SOL) * TSOL * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>
                        <p>
                            Tiêu có {TXRP} XRP tương đương: <strong>{parseInt(TXRP * currentPrice.XRP)}</strong>$ tương đương <strong>{convertToVNDCurrency(TXRP * currentPrice.XRP * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.XRP - openPrice.XRP) * TXRP)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency((currentPrice.XRP - openPrice.XRP) * TXRP * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>
                        Tổng {parseInt(TXRP * currentPrice.XRP + TSOL * currentPrice.SOL)} ~ {convertToVNDCurrency((TXRP * currentPrice.XRP + TSOL * currentPrice.SOL) * vndCurrency)}
                    </li>
                    <li>
                        <p>
                            {XRPdautu} XRP về việt nam: <strong>{parseInt(XRPdautu * currentPrice.XRP) - 14155}</strong>$ tương đương <strong>{convertToVNDCurrency(parseInt(XRPdautu * currentPrice.XRP) - 14155)}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.XRP - openPrice.XRP) * XRPdautu)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency((currentPrice.XRP - openPrice.XRP) * TXRP * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>---------------------------------------------------------------</li>
                    <li>
                        <p>
                            Dì 3 có {di3SOL} SOL tương đương: <strong>{parseInt(di3SOL * currentPrice.SOL)}</strong>$ tương đương <strong>{convertToVNDCurrency(di3SOL * currentPrice.SOL * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.SOL - openPrice.SOL) * di3SOL)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency((currentPrice.SOL - openPrice.SOL) * di3SOL * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>---------------------------------------------------------------</li>
                    <li>
                        <p>
                            Châu có {chauSOL} SOL tương đương: <strong>{parseInt(chauSOL * currentPrice.SOL)}</strong>$ tương đương <strong>{convertToVNDCurrency(chauSOL * currentPrice.SOL * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.SOL - openPrice.SOL) * chauSOL)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency((currentPrice.SOL - openPrice.SOL) * chauSOL * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>
                        <p>
                            Châu có {chauXRP} XRP tương đương: <strong>{parseInt(chauXRP * currentPrice.XRP)}</strong>$ tương đương <strong>{convertToVNDCurrency(chauXRP * currentPrice.XRP * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.XRP - openPrice.XRP) * chauXRP)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency((currentPrice.XRP - openPrice.XRP) * chauXRP * vndCurrency)}</strong>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default App;
