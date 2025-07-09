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
        FLOKI: 0,
    });
    const [openPrice, setOpenPrice] = useState({
        XRP: 0,
        SOL: 0,
        WIF: 0,
        FLOKI: 0,
    });

    useEffect(() => {
        const symbols = ["SOL", "WIF", "FLOKI"];
        const stable = "USDT";
        const sockets = [];

        symbols.forEach((s) => {
            const wsUrl = `wss://stream.binance.us:9443/ws/${s.toLowerCase()}${stable.toLowerCase()}@bookTicker`;
            const socket = new WebSocket(wsUrl);

            let lastUpdate = 0;
            socket.onmessage = (msg) => {
                const parsed = JSON.parse(msg.data);
                const price = parseFloat(parsed.b); // bid price
                const now = Date.now();

                if (now - lastUpdate > 3000) {
                    setCurrentPrice((prev) => ({
                        ...prev,
                        [s]: price,
                    }));
                    lastUpdate = now;
                }
            };

            socket.onerror = (err) => {
                console.error(`${s} WebSocket error`, err);
            };

            sockets.push(socket);

            // Fetch open price
            getOpenPrice(s).then((open) => {
                setOpenPrice((prev) => ({
                    ...prev,
                    [s]: open,
                }));
            });
        });

        return () => {
            sockets.forEach((s) => s.close());
        };
    }, []);

    const QSOL = 176.807;
    const TSOL = 444.499;
    const TWIF = 19051;
    const WIFdautu = 7863;
    const FLOKIdautu = 109398404;
    const di3SOL = 105.13;
    const chauSOL = 125.04;
    const vndCurrency = 24500;
    return (
        <div className="container">
            <div>
                <p>SOL: {currentPrice.SOL}</p>
                <p>WIF: {currentPrice.WIF}</p>
                <p>FLOKI: {currentPrice.FLOKI}</p>
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
                            Tiền về việt nam: <strong>{parseInt(WIFdautu * currentPrice.WIF) + parseInt(FLOKIdautu * currentPrice.FLOKI) - 22920}</strong>, hôm nay <strong>{convertToUSDCurrency((currentPrice.WIF - openPrice.WIF) * WIFdautu + (currentPrice.FLOKI - openPrice.FLOKI) * FLOKIdautu)}</strong>
                            {" tương đương "}
                            <strong>
                                {convertToVNDCurrency(((currentPrice.WIF - openPrice.WIF) * WIFdautu + (currentPrice.FLOKI - openPrice.FLOKI) * FLOKIdautu) * vndCurrency)} ~ {((parseInt(WIFdautu * currentPrice.WIF) + parseInt(FLOKIdautu * currentPrice.FLOKI) - 22920) * 100) / 22920}%
                            </strong>
                        </p>
                    </li>
                    <li>
                        Tổng {parseInt(TWIF * currentPrice.WIF + TSOL * currentPrice.SOL + WIFdautu * currentPrice.WIF + FLOKIdautu * currentPrice.FLOKI)} ~ {convertToVNDCurrency((TWIF * currentPrice.WIF + TSOL * currentPrice.SOL + WIFdautu * currentPrice.WIF + FLOKIdautu * currentPrice.FLOKI) * vndCurrency)}
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
