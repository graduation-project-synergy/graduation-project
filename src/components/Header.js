import React from 'react';
import fullKLogo from './images/fullKLogo.png';
import SLogo from './images/SLogo.png';
import '../App.css'; // App.css 파일을 import
import { Link } from 'react-router-dom';

const Header = ({ searchTerm, setSearchTerm, handleSearch }) => {
    const headerStyle = {
        display: 'flex',
        justifyContent: 'center', // 수평 가운데 정렬
        alignItems: 'center', // 수직 가운데 정렬
        flexDirection: 'column',
    };

    const imageStyle = {
        width: '200px', // 이미지의 너비
        display: 'block', // 이미지를 블록 요소로 만듭니다.
        margin: '0 auto' // 수평 가운데 정렬
    };

    return (
        <header style={headerStyle}>
            <Link to="/PathFinder">
                <img src={fullKLogo} alt="SㅣnerGY FLogo" style={imageStyle} />
            </Link>
            <div className="search-bar">
                <img src={SLogo} alt="SㅣnerGY SLogo"
                     style={{padding:'2px', width:'19px'}}/>
                <input type="text"
                       placeholder="검색어를 입력하세요"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       style={{margin: '0 Auto'}}/>
                <button onClick={handleSearch}>검색</button>
            </div>
        </header>
    );
}

export default Header;