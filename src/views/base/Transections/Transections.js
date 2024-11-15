import React, { useState, useEffect } from 'react';
import './Transections.css';

function Transections() {
    const [products, setProducts] = useState([
        { sku: 'YF-P1-KS-24-L-MAR', name: 'MA1 GENTS KURTA PYJAMA COMPUTER EMBROIDERY', qty: 2, price: 2995, discount: 0 },
        { sku: 'YF-P1-KS-25-XL-MAR', name: 'MA1 GENTS KURTA PYJAMA COMPUTER EMBROIDERY', qty: 5, price: 2995, discount: 0 }
    ]);

    const [salesmen, setSalesmen] = useState([]);
    const [additionalFees, setAdditionalFees] = useState([]);
    const [deliveryFees, setDeliveryFees] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const fetchSalesmen = async () => {
            try {
                const response = await fetch('http://16.171.145.107/pos/transaction/add_salesman');
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setSalesmen(data);
                }
            } catch (error) {
                console.error('Error fetching salesmen:', error);
            }
        };

        const fetchAdditionalFees = async () => {
            try {
                const response = await fetch('http://16.171.145.107/pos/transaction/add_additional_fee');
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setAdditionalFees(data);
                }
            } catch (error) {
                console.error('Error fetching additional fees:', error);
            }
        };

        const fetchDeliveryFees = async () => {
            try {
                const response = await fetch('http://16.171.145.107/pos/transaction/action_additional_fee/id/');
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setDeliveryFees(data);
                }
            } catch (error) {
                console.error('Error fetching delivery fees:', error);
            }
        };

        fetchSalesmen();
        fetchAdditionalFees();
        fetchDeliveryFees();

        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calculateTotal = () => {
        let totalAmount = products.reduce((sum, p) => sum + (p.qty * p.price), 0);
        let totalDiscount = products.reduce((sum, p) => sum + ((p.qty * p.price) * (p.discount / 100)), 0);
        let netTotal = totalAmount - totalDiscount;
        return { totalAmount, totalDiscount, netTotal };
    };

    const { totalAmount, totalDiscount, netTotal } = calculateTotal();

    const formatDateTime = (date) => {
        return date.toLocaleTimeString() + ' | ' + date.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="transactions-page">
            <header className="t-header">
                <h1 className="t-logo">FAZAL SONS</h1>
                <div className="t-header-info">
                    <button className="t-header-button">Today Sales</button>
                    <button className="t-header-button">Sales Return</button>
                    <button className="t-header-button">Due Receivable</button>
                    <button className="t-header-button">Close Till</button>
                    <span className="t-date-time">{formatDateTime(currentDateTime)} | IP: 39.55.138.194</span>
                </div>
                <div className="t-profile">
                    <span className="t-notification-badge">5</span>
                    <span className="t-profile-name">Ali Tehseen</span>
                </div>
            </header>

            <section className="customer-section">
                <select className="customer-select">
                    <option>Walk-In Customer</option>
                </select>
                <button className="add-customer">+</button>
                <select className="salesman-select">
                    <option>Select Salesman</option>
                    {salesmen.map((salesman) => (
                        <option key={salesman.id} value={salesman.id}>
                            {salesman.salesman_name}
                        </option>
                    ))}
                </select>
                <input className="barcode-input" placeholder="Scan Barcode" />
                <input className="search-input" placeholder="Search Products SKU or Name" />
            </section>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Disc. %</th>
                        <th>Disc. Value</th>
                        <th>Net Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.sku}</td>
                            <td>{product.name}</td>
                            <td><input type="number" value={product.qty} className="qty-input" readOnly /></td>
                            <td>{product.price}</td>
                            <td>{product.qty * product.price}</td>
                            <td><input type="number" value={product.discount} className="discount-input" readOnly /></td>
                            <td>{(product.qty * product.price) * (product.discount / 100)}</td>
                            <td>{product.qty * product.price - ((product.qty * product.price) * (product.discount / 100))}</td>
                            <td><button className="remove-button">✖</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <section className="sales-box">
                <div className="fee-select">
                    <label>Additional Fee:</label>
                    <select className="additional-fee-select">
                        <option>Select Additional Fee</option>
                        {additionalFees.map((fee) => (
                            <option key={fee.id} value={fee.id}>
                                {fee.name} - {fee.amount}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="fee-select">
                    <label>Delivery Fee:</label>
                    <select className="delivery-fee-select">
                        <option>Select Delivery Fee</option>
                        {deliveryFees.map((fee) => (
                            <option key={fee.id} value={fee.id}>
                                {fee.name} - {fee.amount}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section className="summary-section">
                <div className="summary-details">
                    <div>Products: {products.length}</div>
                    <div>Sale: {totalAmount}</div>
                    <div>Purchase: 9100</div>
                    <div>Profit: {totalAmount - 9100}</div>
                </div>
                <div className="invoice-summary">
                    <div>Gross: {totalAmount}</div>
                    <div>Discount: {totalDiscount}</div>
                    <div>Net Total: {netTotal}</div>
                    <button className="payment-button">Payment</button>
                </div>
            </section>

            <footer className="footer">
                <span>© Fazal Sons. All Rights Reserved.</span>
            </footer>
        </div>
    );
}

export default Transections;
