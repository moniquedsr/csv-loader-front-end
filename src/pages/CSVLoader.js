import React, { useState } from 'react';
import axios from 'axios';
import './CSVLoader.css';

const CSVLoader = () => {
    const [csvData, setCsvData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleFileLoaded = async (event) => {

        if (event.target.files.length > 0) {
            await uploadCSVData(event.target.files[0])
                .then((res) => {
                    if (res.status === 200) {
                        handleSearch();
                    }
                });

        } else {
            setErrorMessage('Error loading CSV file.');
            setCsvData([]);
        }
    };

    const handleFileError = (error) => {
        setErrorMessage('Error loading CSV file.');
        setCsvData([]);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const uploadCSVData = async (csvData) => {
        console.log(csvData);
        try {
            const formData = new FormData();
            formData.append('csvFile', new Blob([csvData], { type: 'text/csv' }));

            const response = await axios.post('http://localhost:3333/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response;
        } catch (error) {
            console.error('Error uploading CSV data:', error);
            return null;
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/search?q=${searchQuery}`);
            if (response.data) {
                await setCsvData(response.data.filteredData);
                setErrorMessage('');
            } else {
                setErrorMessage('Error fetching search results.');
                setCsvData([]);
            }
        } catch (error) {
            setErrorMessage('Error fetching search results.');
            setCsvData([]);
        }
    };

    return (
        <div className="container">
            <h1>CSV LOADER</h1>
            <label className="file-input-label">
                Select a CSV file
                <input type="file" onChange={handleFileLoaded} style={{ display: 'none' }}></input>
            </label>
            <div className="headerHolder">

                <input
                    type="text"
                    placeholder="Search here..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className="searchButton" onClick={handleSearch}>Search</button>
            </div>
            <div className="cardHolder">
                {csvData?.length > 0 ? (
                    csvData?.map((item, index) => (
                        <div key={index} className="card">
                            <p>Name: {item.name}</p>
                            <p>City : {item.city}</p>
                            <p>Country : {item.country}</p>
                            <p>Favorite Sport : {item.favorite_sport}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-data">No data available at the moment, start uploading your file.</div>
                )}
            </div>
            {!errorMessage && <div className="error">{errorMessage}</div>}
        </div>
    );
};

export default CSVLoader;
