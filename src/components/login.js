import React,{useState} from "react";
import axios  from "axios";
import {useNavigate} from 'react-router-dom';
import '../style/main.css';
import '../style/login.css'

const Login = () => {
    const [inputId, setInputId] = useState('');
    const [inputPw, setInputPw] = useState('');

    const handleInputId = (e) => {
        setInputId(e.target.value);
    }
    const handleInputPw = (e) => {
        setInputPw(e.target.value);
    }
    const navigate  = useNavigate();

    const onClickLogin = async(e) => {
        //e.preventDefault();
        const res = await axios.post('/login', {
            data: {
                'exId' : inputId,
                'pwd': inputPw
            }
        });
        if(res.data.resultCode != '00'){
            alert('알 수 없는 문제가 발생하여 로그인에 실패하였습니다.')
        }else {
            console.log(res);
            // const isLogin = true;
            // const ath = res.data.data.content[0].ath;
            // const userNm = res.data.data.content[0].nm;
            // const exId = res.data.data.content[0].exId;
            navigate(`/incdnt-inq`);
        }
    }
    const onKeyPress = e => {
        if(e.key === 'Enter'){
            onClickLogin();
        }
    }

    return (
        <div className="Cardbody">
            <h1>로그인</h1>
            <div className="Card">
                <div className="LoginBox">
                    <form>
                        <div className="FormGroup">
                            <label className="TextBox" htmlFor="username" >아이디</label>
                            <input className="InputBox2" type='text' name="username" value={inputId} onChange={handleInputId}/>
                        </div>
                        <div className="FormGroup">
                            <label htmlFor="password">패스워드</label>
                            <input className="InputBox2" type='password' name="password" value={inputPw} onChange={handleInputPw} onKeyPress={onKeyPress} />
                        </div>
                        <div>
                            <button className="BtnLogin BtnBlock" type="button" onClick={onClickLogin}>로그인</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;