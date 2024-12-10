import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
    const [data, setData] = useState(null);
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://adminmoneymachine.minhnguyen.website:1234/landing/token/price/SOLUSDT`);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const QSOL = 268.3;
    const TSOL = 500;
    const di3SOL = 130.86;
    const chauSOL = 82.023;
    const total = parseInt((QSOL + TSOL) * data);
    const vndCurrency = 24000;
    return (
        <div className="container">
            {data ? (
                <div>
                    <p>Giá SOL: {data}</p>
                    <p>Giá $: {convertToVNDCurrency(vndCurrency)}</p>
                    <p>
                        Quâỵ có {QSOL} SOL tương đương: {parseInt(QSOL * data)}$ tương đương <strong>{convertToVNDCurrency(QSOL * data * vndCurrency)}</strong>
                    </p>
                    <p>
                        Tiêu có {TSOL} SOL tương đương: {parseInt(TSOL * data)}$ tương đương <strong>{convertToVNDCurrency(TSOL * data * vndCurrency)}</strong>
                    </p>
                    <p>
                        Tổng 2 thằng có: {(QSOL + TSOL).toFixed(2)} SOL tương đương: <strong>{convertToUSDCurrency(total)}</strong> tương đương <strong>{convertToVNDCurrency(total * vndCurrency)}</strong>
                    </p>
                    <p>
                        Dì 3 có {di3SOL} SOL tương đương: {parseInt(di3SOL * data)}$ tương đương <strong>{convertToVNDCurrency(di3SOL * data * vndCurrency)}</strong>
                    </p>
                    <p>
                        Châu có {chauSOL} SOL tương đương: {parseInt(chauSOL * data)}$ tương đương <strong>{convertToVNDCurrency(chauSOL * data * vndCurrency)}</strong>
                    </p>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default App;
