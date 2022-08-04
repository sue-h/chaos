import React from "react";
import "../style/main.css";
import "./menubar";

const Main = () => {
    return (
        <div>
            <div className="Cardbody">
                <div className="Card">
                    <img alt = "sg" src={require('../images/sg.dcdba75.png')}/>
                    <div className="TextCenter">
                        <h4>Softgram Chaos</h4>
                        <br/>
                        <br/>
                        <br/>
                        <a href="/login" className="BtnBlock" >로그인</a>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Main;