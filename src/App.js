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
        WIF: 0,
    });
    const [openPrice, setOpenPrice] = useState({
        XRP: 0,
        SOL: 0,
        WIF: 0,
    });

    useEffect(() => {
        const symbol = ["SOL", "XRP", "WIF"];
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

    const QSOL = 12;
    const TSOL = 466.499;
    const TWIF = 13548;
    const WIFdautu = 19459;
    const di3SOL = 105.13;
    const chauSOL = 125.04;
    const vndCurrency = 24500;
    return (
        <div className="container">
            <div>
                <p>SOL: {currentPrice.SOL}</p>
                <p>WIF: {currentPrice.WIF}</p>
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
                            Tiêu có {TWIF} WIF tương đương: <strong>{parseInt(TWIF * currentPrice.WIF)}</strong>$ tương đương <strong>{convertToVNDCurrency(TWIF * currentPrice.WIF * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.WIF - openPrice.WIF) * TWIF)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency((currentPrice.WIF - openPrice.WIF) * TWIF * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>
                        <p>
                            {WIFdautu} WIF về việt nam: <strong>{parseInt(WIFdautu * currentPrice.WIF) - 21920}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.WIF - openPrice.WIF) * WIFdautu)}</strong>
                            {" tương đương "}
                            <strong>
                                {convertToVNDCurrency((currentPrice.WIF - openPrice.WIF) * WIFdautu * vndCurrency)} ~ {((parseInt(WIFdautu * currentPrice.WIF) - 21920) * 100) / 21920}%
                            </strong>
                        </p>
                    </li>
                    <li>
                        Tổng {parseInt(TWIF * currentPrice.WIF + TSOL * currentPrice.SOL + WIFdautu * currentPrice.WIF)} ~ {convertToVNDCurrency((TWIF * currentPrice.WIF + TSOL * currentPrice.SOL + WIFdautu * currentPrice.WIF) * vndCurrency)}
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
                </ul>
            </div>
        </div>
    );
};

export default App;
