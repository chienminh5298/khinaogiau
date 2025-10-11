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
        SOL: 0,
        PENGU: 0,
        BONK: 0,
    });
    const [openPrice, setOpenPrice] = useState({
        SOL: 0,
        PENGU: 0,
        BONK: 0,
    });

    useEffect(() => {
        const symbols = ["SOL", "PENGU", "BONK"];
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

    const di3SOL = 105.13;
    const chauSOL = 125.04;
    const QSOL = 0;
    const TSOL = 340;
    const TPENGU = 886072;
    const TBONK = 1043573636;

    const BONKdautu = 205419850;
    const PENGUdautu = 512547;

    const vndCurrency = 26000;

    const PENGUchange = currentPrice.PENGU - openPrice.PENGU;
    const BONKchange = currentPrice.BONK - openPrice.BONK;
    const SOLchange = currentPrice.SOL - openPrice.SOL;

    return (
        <div className="container">
            <div>
                <p>SOL: {currentPrice.SOL}</p>
                <p>PENGU: {currentPrice.PENGU}</p>
                <p>BONK: {currentPrice.BONK}</p>
                <p>Giá $: {convertToVNDCurrency(vndCurrency)}</p>
                <ul>
                    <li>---------------------------------------------------------------</li>
                    <li>
                        <p>
                            Quâỵ có {QSOL} SOL tương đương: <strong>{parseInt(QSOL * currentPrice.SOL)}</strong>$ `tương đương <strong>{convertToVNDCurrency(QSOL * currentPrice.SOL * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency(SOLchange * QSOL)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency(SOLchange * QSOL * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>---------------------------------------------------------------</li>
                    <li>
                        <p>
                            Tiêu có {TSOL} SOL tương đương: <strong>{parseInt(TSOL * currentPrice.SOL)}</strong>$ tương đương <strong>{convertToVNDCurrency(TSOL * currentPrice.SOL * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency(SOLchange * TSOL)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency(SOLchange * TSOL * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>
                        <p>
                            Tiêu có {TBONK} BONK tương đương: <strong>{parseInt(TBONK * currentPrice.BONK)}</strong>$ tương đương <strong>{convertToVNDCurrency(TBONK * currentPrice.BONK * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency(BONKchange * TBONK)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency(BONKchange * TBONK * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>
                        <p>
                            Tiêu có {TPENGU} PENGU tương đương: <strong>{parseInt(TPENGU * currentPrice.PENGU)}</strong>$ tương đương <strong>{convertToVNDCurrency(TPENGU * currentPrice.PENGU * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency(PENGUchange * TPENGU)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency(PENGUchange * TPENGU * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>
                        <p>Quy ra sol {(TPENGU * currentPrice.PENGU + TBONK * currentPrice.BONK) / currentPrice.SOL + TSOL}</p>
                    </li>
                    <li>
                        <p>PENGUdautu: {PENGUdautu}</p>
                        <p>BONKdautu: {BONKdautu}</p>
                        <p>
                            Tiền về việt nam: <strong>{parseInt(PENGUdautu * currentPrice.PENGU) + parseInt(BONKdautu * currentPrice.BONK) - 24097}</strong>, hôm nay <strong>{convertToUSDCurrency(PENGUchange * PENGUdautu + BONKchange * BONKdautu)}</strong>
                            {" tương đương "}
                            <strong>
                                {convertToVNDCurrency((PENGUchange * PENGUdautu + BONKchange * BONKdautu) * vndCurrency)} ~ {((parseInt(PENGUdautu * currentPrice.PENGU) + parseInt(BONKdautu * currentPrice.BONK) - 24097) * 100) / 24097}%
                            </strong>
                        </p>
                    </li>
                    <li>
                        Tổng {parseInt(TSOL * currentPrice.SOL + (PENGUdautu + TPENGU) * currentPrice.PENGU + (BONKdautu + TBONK) * currentPrice.BONK)} ~ {convertToVNDCurrency((TSOL * currentPrice.SOL + (PENGUdautu + TPENGU) * currentPrice.PENGU + (BONKdautu + TBONK) * currentPrice.BONK) * vndCurrency)}
                    </li>
                    <li>---------------------------------------------------------------</li>
                    <li>
                        <p>
                            Dì 3 có {di3SOL} SOL tương đương: <strong>{parseInt(di3SOL * currentPrice.SOL)}</strong>$ tương đương <strong>{convertToVNDCurrency(di3SOL * currentPrice.SOL * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency(SOLchange * di3SOL)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency(SOLchange * di3SOL * vndCurrency)}</strong>
                        </p>
                    </li>
                    <li>---------------------------------------------------------------</li>
                    <li>
                        <p>
                            Châu có {chauSOL} SOL tương đương: <strong>{parseInt(chauSOL * currentPrice.SOL)}</strong>$ tương đương <strong>{convertToVNDCurrency(chauSOL * currentPrice.SOL * vndCurrency)}</strong>, hôm nay <strong>{convertToUSDCurrency(SOLchange * chauSOL)}</strong>
                            {" tương đương "}
                            <strong>{convertToVNDCurrency(SOLchange * chauSOL * vndCurrency)}</strong>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default App;
