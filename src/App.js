import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
    const [data, setData] = useState(null);

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
    const QSOL = 300;
    const TSOL = 422;
    return (
        <div className="container">
            {data ? (
                <div>
                    <p>Giá SOL: {data}</p>
                    <p>
                        Quâỵ có {QSOL} SOL tương đương: {parseInt(QSOL * data)}$
                    </p>
                    <p>
                        Tiêu có {TSOL} SOL tương đương: {parseInt(TSOL * data)}$
                    </p>
                    <p>
                        Tổng 2 thằng có: {QSOL + TSOL} tương đương: {parseInt((QSOL + TSOL) * data)}$
                    </p>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default App;
