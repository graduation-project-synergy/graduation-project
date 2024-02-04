// Home.js
import React, { useState } from 'react';
import Header from './Header';
import UOSLogo from './images/uosMark.png';
import Map from './MapC';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const [keyword, setKeyword] = useState('');
    return (
        <div>
            <Header handleSearch={() => {
                setKeyword(searchTerm);
            }} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Map width='100%' height='630px' keyword={keyword}/>
            <div className="mid-logo">
                <a href="https://www.uos.ac.kr/main.do?epTicket=INV" style={{ margin: '0 auto' }}>
                    <img src={UOSLogo} alt="UOS Logo for link" style={{ width: '160px', margin: '0 auto' }} />
                </a>
            </div>
        </div>
    );
};

export default Home;