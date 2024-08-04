import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
	const [data, setData] = useState(null);
	function convertToVNDCurrency(number) {
		const formatter = new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});
		return formatter.format(number);
	}
	function convertToUSDCurrency(number) {
		const formatter = new Intl.NumberFormat('en-EN', {
			style: 'currency',
			currency: 'USD',
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
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);
	const QSOL = 311.57;
	const TSOL = 430;
	const total = parseInt((QSOL + TSOL) * data);
	const vndCurrency = 24000;
	return (
		<div className='container'>
			{data ? (
				<div>
					<p>Giá SOL: {data}</p>
                    <p>Giá $: {convertToVNDCurrency(vndCurrency)}</p>
					<p>
						Quâỵ có {QSOL} SOL tương đương: {parseInt(QSOL * data)}$
					</p>
					<p>
						Tiêu có {TSOL} SOL tương đương: {parseInt(TSOL * data)}$
					</p>
					<p>
						Tổng 2 thằng có: {(QSOL + TSOL).toFixed(2)} SOL tương đương: <strong>{convertToUSDCurrency(total)}</strong> tương đương <strong>{convertToVNDCurrency(total * vndCurrency)}</strong>
					</p>
				</div>
			) : (
				<p>Loading data...</p>
			)}
		</div>
	);
};

export default App;
