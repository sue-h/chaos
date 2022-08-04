import React, { useState } from "react";
import {Link} from 'react-router-dom';
import '../style/menubar.css';
import styled from "styled-components";
import { AiFillCaretDown } from "react-icons/ai";

// const ListItem = ({
//     title,
//     list,
//     active,
//     activeIndex,
//     setActiveIndex,
//     idx,
// }) => {


// }
// const NavDropDown = () => {
//     const NavItemList = [
//         {title : 'dev', list: ['시스템관리자', 'Vue.js', 'BootstrapVue', 'tui-grid', '카오스 운영']},
//         {title : 'bookmark' , list: ['인터넷등기소', '일사편리', '사람인', '케이리포트', 'KB부동산시세']},
//         {title : 'admin' , list: ['로그아웃']}
//     ]
//     const [activeIndex, setActiveIndex] = useState();
//     return (
//         <div>
//             <ul>
//                 {NavItemList.map((item, idx) => {
//                     const active = idx === activeIndex ? 'active': '';

//                     return (
//                         <ListItem
//                             title= {item.title}
//                             idx={item.idx}
//                             list={item.list}
//                             active={active}
//                             activeIndex={activeIndex}
//                             setActiveIndex={setActiveIndex}
//                         />
//                     );
//                 })}
//             </ul>
//         </div>
//     )
// }

const MenuBar = () => {
    const DropDown = styled.button`
        text-align: right;
        border: none;
        outline:none;
        position: relative;
        width: 160px;
        background-color : transparent;
        color : #fff;
        list-style: none;
        float: left; 
        padding: 1rem;
    `;
    const ListContainer = styled.div`
        background-color: #fff;
        color: #343a40;
        border-radius: 5px;
        padding: 0.5rem 0;
        margin: 0.125rem 0 0;
        font-size: 1rem;
        text-align: left;
        position: absolute;
        display:none;
        //background-clip: padding-box;
        border: 1px solid rgba(0,0,0,.15);
        border-radius: 0.25rem;
        ${DropDown}:active & {
        display: block;
        }
        ${DropDown}:focus & {
        display: block;
        }
  `;
    return (
        <div className="NavContainer">
            <nav className="Navbar" >
                <Link to = '/' className="MainLogo">Chaos</Link>
                <div className="Navmenu">
                    <ul className="LeftMenu">
                        <Link to='/incdnt-inq'>통합조회</Link>    
                        <Link to='/incdnt-inq'>통합조회</Link>
                        <Link to='/incdnt-inq'>크레프트</Link>
                        <Link to='/incdnt-inq'>사건조회</Link>
                        <Link to='/incdnt-inq'>관공사조회</Link>
                        <Link to='/incdnt-inq'>사공사조회</Link>
                        <Link to='/incdnt-inq'>공탁금조회</Link>
                        <Link to='/incdnt-inq'>사공사일반조회</Link>
                        <Link to='/incdnt-inq'>사건확인조회</Link>
                        <Link to='/incdnt-inq'>활동내역</Link>
                        <Link to='/incdnt-inq'>활동내역확인</Link>
                    </ul>
                    <DropDown>
                        <li className="RightMenu">개발용 <AiFillCaretDown /> </li>
                            <ListContainer>
                            <ul className="DropDown">
                                <li><Link to=''>시스템관리자</Link></li>
                                <li><Link to=''>React.js</Link></li>
                                <li><Link to=''>Bootstrap</Link></li>
                                <li><Link to=''>mui-grid</Link></li>
                                <li><Link to=''>카오스 운영</Link></li>
                            </ul>
                            </ListContainer>
                    </DropDown>
                    <DropDown>
                        <li className="RightMenu">즐겨찾기 <AiFillCaretDown /> </li>
                            <ListContainer>
                            <ul className="DropDown">
                                <li><Link to=''>인터넷등기소</Link></li>
                                <li><Link to=''>일사편리</Link></li>
                                <li><Link to=''>사람인</Link></li>
                                <li><Link to=''>케이리포트</Link></li>
                                <li><Link to=''>KB부동산시세</Link></li>
                            </ul>
                            </ListContainer>
                    </DropDown>
                    <DropDown>
                        <li className="RightMenu">admin <AiFillCaretDown /> </li>
                            <ListContainer>
                            <ul className="DropDown">
                                <li><Link to=''>로그아웃</Link></li>
                            </ul>
                            </ListContainer>
                    </DropDown>
                </div>
            </nav>
        </div>
    );
}

export default MenuBar;