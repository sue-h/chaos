import React, { useState, useEffect } from "react";
import MenuBar from "./menubar";
import '../style/incdntinq.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'tui-grid/dist/tui-grid.css';
import axios from "axios";
import  {DataGrid }  from "@mui/x-data-grid";

//법원 이름 변환
const convLwcNmCd = (Bubwon, Bob) => {
    for(var i=0; i< Bob.length; i++){
        if(Bubwon === Bob[i].key) break;
    }
    return Bob[i].value ? Bob[i].value : '';
}
//부호 변환
const convSgnNmCd = (Bubwon, Buho) => {
    for(var i=0; i< Buho.length; i++){
        if(Bubwon === Buho[i].key) break;
    }
    return Buho[i].value ? Buho[i].value : '';
}
//관계자 도출
const convSe = (content, se1,se2,se3) => {
    let res = '';
    for(var i = 1; i < content.length; i++){
        if(content[i].se === se1 || content[i].se === se2 || content[i].se === se2)
        res += content[i].nm.replace(/[1-9]/g, '').replace('.', '').replace('주식회사', '').replace('유한회사', '').replace('대표이사', '') + `\n` ;
    }
    return res;
}
//관련사건 추출
const resIndList = (gifBsCrnIcdList, Bob, Buho) => {
    let res = '';
    for(var i=0; i<gifBsCrnIcdList.length; i++){
        res += convLwcNmCd(gifBsCrnIcdList[i].lwcCd, Bob) + ' ';
        res += gifBsCrnIcdList[i].icdYear;
        res += convSgnNmCd(gifBsCrnIcdList[i].icdSgn, Buho);
        res += gifBsCrnIcdList[i].icdSn;
        res += `\n`
    }
    return res;
}
//DatePicker 날짜변환
const convDatePicker = (dateP) => {
    let dateS =  dateP.toString().split(' ');
    let lun = '';
    switch (dateS[1]){
        case 'Jan' : 
            lun = '01'; break;
        case 'Feb' : 
            lun = '02'; break;
        case 'Mar' : 
            lun = '03'; break;
        case 'Apr' : 
            lun = '04'; break;
        case 'May' : 
            lun = '05'; break;
        case 'Jun' : 
            lun = '06'; break;
        case 'Jul' : 
            lun = '07'; break;
        case 'Aug' : 
            lun = '08'; break;
        case 'Sep' : 
            lun = '09'; break;
        case 'Oct' : 
            lun = '10'; break;
        case 'Nov' : 
            lun = '11'; break;
        case 'Dec' : 
            lun = '12'; break;
        default: break;
    }
    return dateS[3] + lun + dateS[2];
}

//날짜변환 (20220803 -> 2022-08-03)
const convDateVar = (dateV) => {
    let res = '';
    if(convAmt){
        res = dateV.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }
    return res;
}

//금액변환 (1340000 => 1,340,000)
const convAmt = (amt) => {
    let res = '';
    if(amt){
        res = amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return res;
}



//MAIN
const IncdntInq = () => {
    //01. props 선언
    const [BubwonName, setBubwonName] = useState(''); //법원명
    const [SagunBuho, setSagunBuho] = useState(''); //사건부호
    const [icdYear, setIcdYear] = useState(''); //사건년도
    const [icdSn, setIcdSn] = useState('') //사건부호
    const [icdNm, setIcdNm] = useState(''); //사건명
    const [StartDate, setStartDate] = useState(''); //접수시작일
    const [EndDate, setEndDate] = useState(); //접수종료일
    const [StartDataDate, setStartDataDate] = useState(); //데이터등록 시작일
    const [EndDataDate, setEndDataDate] = useState(); //데이터등록 종료일
    const [cdrNmOrAcrNm, setCdrNmOrAcrNm] = useState(''); // 원고
    const [dbrNmOrDfdNm, setDbrNmOrDfdNm] = useState(''); //피고
    const [patThrdDbr, setPatThrdDbr] = useState(''); //제3채무자
    const [relNm, setRelNm] = useState(''); //관계인명
    const [cnfrmr, setCnfrmr] = useState(''); //사건 확인자
    const [totalElements, setTotalElements] = useState(0); //전체 조회 갯수
    //법원명 리스트
    const [Bob, setBob] = useState([{
        key: '',
        value: '',
    }]);
    //사건부호 리스트
    const [Buho, setBuho] = useState([{
        key: '',
        value: '',
    }]);
    //결과 데이터
    const [GridData, setGridData] = useState([{
        id: '',
        lwcCdNm:'',
        icdYear: '',
        icdSgnNm: '',
        icdSn: '',
        icdNoObj: '',
        icdNm: '',
        cdrNm:'',
        dbrNm:'',
        thrdDbrNm:'',
        acrLwsAmt:'',
        accDt: '',
        createdDtm: '',
        endRlt: '',
        bsCrnIcdList:'',
        gifBsMgeListAmt: '',
        gifBsMgeListOfrDt:'',
        cnfrmr: '',
    }]);

    //02. 이벤트 등록
    const onChangeYear = (e) => {
        setIcdYear(e.currentTarget.value);
    }
    const onChangeIcdSn = e => {
        setIcdSn(e.currentTarget.value);
    }
    const onChangeBubName = (e) => {
        setBubwonName(e.currentTarget.value);
    }
    const onChangeIcdNm = e => {
        setIcdNm(e.currentTarget.value);
    }
    const onChangeCdrNmOrAcrNm = e => {
        setCdrNmOrAcrNm(e.currentTarget.value);
    }
    const onChangeDbrNmOrDfdNm = e => {
        setDbrNmOrDfdNm(e.currentTarget.value);
    }
    const onChangePatThrdDbr = e => {
        setPatThrdDbr(e.currentTarget.value);
    }
    const onChangeRelNm = e => {
        setRelNm(e.currentTarget.value);
    }
    const onChangeCnfrmr = e => {
        setCnfrmr(e.currentTarget.value);
    }
    const onChangeSagunBuho = (e) => {
        setSagunBuho(e.currentTarget.value);
    }

    //03. API 호출

    //법원명 리스트
    useEffect( () => {
        async function fetchData(){
            const res = await axios.get('/cmmn-cd/lwc-inf');
            const inputdataa = await res.data.data.content.map((rowData) => ({
                key: rowData.lwcCd,
                value: rowData.lwcNm,
            }));
            setBob(Bob.concat(inputdataa));
        }
        fetchData();
    },[]);
    //사건부호 리스트
    useEffect( () => {
        async function fetchData(){
            const res = await axios.get('/cmmn-cd/sgn-inf');
            const inputdataa = await res.data.data.content.map((rowData) => ({
                key: rowData.sgnCd,
                value: rowData.sgnNm,
                id: rowData.id,
            }));
            setBuho(Buho.concat(inputdataa));
        }
        fetchData();
    },[]);
    //조회결과 리스트
    const onSubmitList =async (e) => {
        e.preventDefault();
        //결과데이터 초기화
        setGridData([{
            id: '',
            lwcCdNm:'',
            icdYear: '',
            icdSgnNm: '',
            icdSn: '',
            icdNoObj: '',
            icdNm: '',
            cdrNm:'',
            thrdDbrNm:'',
            acrLwsAmt:'',
            accDt: '',
            createdDtm: '',
            endRlt: '',
            bsCrnIcdList:'',
            gifBsMgeListAmt: '',
            gifBsMgeListOfrDt:'',
            cnfrmr: '',
        }])
        var rowCount = 0;
        const res = await axios.post('/icd/pcr-base', {data, pageSort});
        setTotalElements(res.data.data.totalElements); //전체갯수
        const inputdataa = await res.data.data.content.map((rowData) => ({
            id: ++rowCount,
            //법원명
            lwcCdNm: convLwcNmCd(rowData.iifBsc.lwcCd, Bob),
            //사건년도
            icdYear: rowData.iifBsc.icdYear,
            //사건부호
            icdSgnNm: convSgnNmCd(rowData.iifBsc.icdSgn, Buho),
            icdSn: rowData.iifBsc.icdSn,
            //법원사건부호
            icdNoObj : rowData.iifBsc.icdYear + convSgnNmCd(rowData.iifBsc.icdSgn, Buho) + rowData.iifBsc.icdSn,
            icdNm: rowData.iifBsc.icdNm,
            //원고
            cdrNm: rowData.gifBsPcrList[0].nm.replace(/[1-9]/g, '').replace('.', ''),
            //피고
            dbrNm: convSe(rowData.gifBsPcrList, '채무자', '피신청인', '상대방'),
            //제3채무자
            thrdDbrNm: convSe(rowData.gifBsPcrList, '제3채무자'),
            //원고소가
            acrLwsAmt: rowData.iifBsc.dmdAmt ? convAmt(rowData.iifBsc.dmdAmt) : convAmt(rowData.iifBsc.acrLwsAmt) ,
            //접수일
            accDt: convDateVar(rowData.iifBsc.accDt),
            //데이터 등록일
            createdDtm: convDateVar(rowData.iifBsc.createdDtm),
            //종국결과
            endRlt: rowData.iifBsc.endRlt,
            //관련사건내용
            bsCrnIcdList: rowData.gifBsCrnIcdList ? resIndList(rowData.gifBsCrnIcdList, Bob, Buho) : '', 
            //담보내용 -담보금 , 담보제공일
            gifBsMgeListAmt: rowData.gifBsMgeList ? (rowData.gifBsMgeList[0].amt.includes('현금') ? rowData.gifBsMgeList[0].amt : '' ): '', //담보금
            gifBsMgeListOfrDt: rowData.gifBsMgeList ?(rowData.gifBsMgeList[0].amt.includes('현금') ? convDateVar(rowData.gifBsMgeList[0].ofrDt) : '' ): '', //담보제공
            //확인자
            cnfrmr: !rowData.iifBsc.cnfrmr ? "Y" : "N",

        }));
        console.log(inputdataa);
        setGridData(GridData.slice(0,1));
        setGridData(GridData.concat(inputdataa));
    }

    //검색 넘길 데이터값1
    let data = {
        inqNm : '', 
        lwcCd : BubwonName,
        icdSgn: SagunBuho,
        icdYear : icdYear,
        icdSn : icdSn,
        relNm: relNm,
        cdrNmOrAcrNm: cdrNmOrAcrNm,
        dbrNmOrDfdNm: dbrNmOrDfdNm,
        patThrdDbr: patThrdDbr,
        sFromAccDt: StartDate ? convDatePicker(StartDate) : '',
        sToAccDt: EndDate ? convDatePicker(EndDate) : '',
        dtpFromAccDt:StartDate ? convDateVar(convDatePicker(StartDate)) : '',
        dtpToAccDt: EndDate ? convDateVar(convDatePicker(EndDate)) : '',
        crtDtmFrom: StartDataDate ? convDatePicker(StartDataDate): '',
        crtDtmTo: EndDataDate ? convDatePicker(EndDataDate): '' ,
        dtpCrtDtmFrom: StartDataDate ? convDateVar(convDatePicker(StartDataDate)) : '',
        dtpCrtDtmTo: EndDataDate ? convDateVar(convDatePicker(EndDataDate)) : '',
        cnfrmr: cnfrmr,
        icdNm : icdNm,
    };
    //검색 넘길 데이터값2
    let pageSort = {
        page: 0,
        size: 500,
        isEnd: false,
    }


    //결과표 옵션
    const GridProps = {
        options : {
            header : {height: 30},
            //rowHeight: 'auto',
            //bodyHeight: 'fitToParent',
        },
        columns : [
            {
                headerName : 'No',
                field: 'id',
                align: "center",
                width: 10
            },
            {
                headerName: '법원명',
                field: 'lwcCdNm',
                align: "left",
                width: 140
            },
            {
                headerName: '년도',
                field: 'icdYear',
                align: "center",
                width: 55
            },
            {
                headerName: '부호',
                field: 'icdSgnNm',
                align: 'center',
                width: 50
            },
            {
                headerName: '순번',
                field: 'icdSn',
                align: "center",
                width: 60
            },
            {
                headerName: '법원사건번호',
                field: 'icdNoObj',
                align: "left",
                width: 130,
            },
            {
                headerName: '사건명',
                field: 'icdNm',
                align: "left",
                width: 96
            },
            {
                headerName: '원고(채권자/신청인/항고인)',
                field: 'cdrNm',
                align: "left",
                width: 150
            },
            {
                headerName: '피고(채무자/피신청인/상대방)',
                field: 'dbrNm',
                align: "left",
                width: 150
            },
            {
                headerName: '제3채무자',
                field: 'thrdDbrNm',
                align: "left",
                width: 120
            },
            {
                headerName: '원고소가',
                field: 'acrLwsAmt',
                align: "right",
                width: 85,
            },
            {
                headerName: '접수일',
                field: 'accDt',
                align: "center",
                width: 95
            },
            {
                headerName: '등록일',
                field: 'createdDtm',
                align: "center",
                width: 95
            },
            {
                headerName: '종국결과',
                field: 'endRlt',
                align: "left",
                width: 140
            },
            {
                headerName: '관련사건내용',
                field: 'bsCrnIcdList',
                align: "left",
                width: 170,
            },
            {
                headerName: '담보금',
                field: 'gifBsMgeListAmt',
                align: "right",
                width: 100
            },
            {
                headerName: '담보제공',
                field: 'gifBsMgeListOfrDt',
                align: "center",
                width: 95
            },
            {
                headerName: '확인자',
                field: 'cnfrmr',
                align: 'left',
            },
        ],
    };

    return (
        <div className="Container">
            <MenuBar />
            <h3>사건조회</h3>
            <div className="IncdntinqContainer">
                <div className="FilterBox">
                    <div className="SelectBox">
                        <label className="LabelName">법원명</label>
                        <br />
                        <select className="SelectArrow" onChange={onChangeBubName} value={BubwonName}>
                            {Bob.map((item) => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="SelectBox">
                        <label>사건부호</label>
                        <br />
                        <select className="SelectArrow" onChange={onChangeSagunBuho} value={SagunBuho}>
                            {Buho.map((item,index) => (
                                <option key={item.id} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="SelectBox">
                        <label>사건년도</label>
                        <br/>
                        <input className="InputBox" placeholder="4자리" onChange={onChangeYear} value={icdYear}></input>
                    </div>
                    <div className="SelectBox">
                        <label>사건번호</label>
                        <br/>
                        <input className="InputBox" placeholder="7자리이내" onChange={onChangeIcdSn} value={icdSn}></input>
                    </div>
                    <div className="SelectBox">
                        <label>사건명</label>
                        <br/>
                        <input className="InputBox" placeholder="사건명" onChange={onChangeIcdNm} value={icdNm}></input>
                    </div>
                    <div className="SelectBox SelectDateBox">
                    <label>접수(계약)시작일</label>
                        <DatePicker 
                            className="DataPick" 
                            selected={StartDate} 
                            onChange={(date) => setStartDate(date)} 
                            closeOnScroll={true}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="YYYY-MM-DD"
                        />
                    </div>
                    <div className="SelectBox SelectDateBox">
                    <label>접수(계약)종료일</label>
                        <DatePicker 
                            className="DataPick" 
                            selected={EndDate} 
                            onChange={(date) => setEndDate(date)} 
                            closeOnScroll={true}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="YYYY-MM-DD"
                        />
                    </div>
                    <div className="SelectBox SelectDateBoxT">
                    <label>데이터 등록 시작일</label>
                        <DatePicker 
                            className="DataPickT" 
                            selected={StartDataDate} 
                            onChange={(date) => setStartDataDate(date)} 
                            closeOnScroll={true}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="YYYY-MM-DD"
                        />
                    </div>
                    <div className="SelectBox SelectDateBoxT"> 
                    <label>데이터 등록 종료일</label>
                        <DatePicker 
                            className="DataPickT" 
                            selected={EndDataDate} 
                            onChange={(date) => setEndDataDate(date)} 
                            closeOnScroll={true}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="YYYY-MM-DD"
                        />
                    </div>
                    <div className="SelectBox">
                        <label>원고</label>
                        <br/>
                        <input className="InputBox" placeholder="채권자/신청인/항고인" onChange={onChangeCdrNmOrAcrNm} value={cdrNmOrAcrNm}></input>
                    </div>
                    <div className="SelectBox">
                        <label>피고</label>
                        <br/>
                        <input className="InputBox" placeholder="채무자/피신청인/상대방" onChange={onChangeDbrNmOrDfdNm} value={dbrNmOrDfdNm}></input>
                    </div>
                    <div className="SelectBox">
                        <label>제3채무자</label>
                        <br/>
                        <input className="InputBox" placeholder="제3채무자" onChange={onChangePatThrdDbr} value={patThrdDbr}></input>
                    </div>
                    <div className="SelectBox">
                        <label>관계인명 (업체명)</label>
                        <br/>
                        <input className="InputBox" placeholder="관계인명" onChange={onChangeRelNm} value={relNm}></input>
                    </div>
                    <div className="SelectBox">
                        <label>사건 확인자</label>
                        <br/>
                        <input className="InputBox" placeholder="사건 확인자" onChange={onChangeCnfrmr} value={cnfrmr}></input>
                    </div>
                </div>
                <div className="SubmitBox">
                    <form className="SubmitButton" onSubmit={onSubmitList}>
                        <button type="submit" className="FilterButton">
                            조회
                        </button>
                    </form>
                    <div>
                        <span>조회: {totalElements} 건 </span>
                    </div>
                </div>
                <div>
                    <div style={{ height: 600, width: "100%" }}>
                    <DataGrid
                        rows={GridData}
                        columns={GridProps.columns}
                        //rowsPerPageOptions={[30]}
                      />
                    </div>
                </div>
            </div>
            <div>
                {/* <span>[참고] 해당 페이지는 크롬(크로뮴 계열) 및 파이어폭스에 최적화 되어 있습니다.</span> */}
            </div>
        </div>
    );
}


export default IncdntInq;