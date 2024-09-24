import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';

const NewsList = () => {

    const [append_NboardList, setAppend_NboardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState('');
    // const [startPage, setStartPage] = useState('');
    // const [endPage, setEndPage] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchtype, setSearchtype] = useState('');

    useEffect(() => {
        callNboardListApi(currentPage);
        // $("#spaging").hide();
    }, []);
// 
    const callNboardListApi = (page) => {
        // axios.get(`/api/news/${page}`)
        axios.get('http://localhost:8080/api/news')
            .then(response => {
                try {
                    setAppend_NboardList(nBoardListAppend(response.data));
                    //setTotalPages(response.data.pageMaker.totalPage);
                    //setStartPage(response.data.pageMaker.startPage);
                    //setEndPage(response.data.pageMaker.endPage);
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    };

    const nBoardListAppend = (nBoard) => {
        let result = [];
        let nBoardList = nBoard.newslist;
        
        for (let i = 0; i < nBoardList.length; i++) {
            let data = nBoardList[i];
            // const formattedDate = new Date(data.pdate).toLocaleDateString('ko-KR', {
            //     year: 'numeric',
            //     month: '2-digit',
            //     day: '2-digit',
            // }).split('.').join('/').replace(/\s/g, '');

            // const trimmedDate = formattedDate.slice(0, -1);

            result.push(
                <tr className="hidden_type">
                    <td>{data.pno}</td>
                    {/* <td><Link to={`NboardRead/${data.pno}`}>{data.title}{data.mno > 0 && `[${data.mno}]`}</Link></td> */}
                    <td>{data.pno}</td>
                    <td>{data.pcount}</td>
                    <td>{data.psource}</td>
                    <td>{data.pdate}</td>
                </tr>
            )
        }
        return result;
    };

    return (
        <section className="sub_wrap" >
            <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                <div className="li_top">
                    <h2 className="s_tit1">공 지 사 항</h2>
                    <div className="li_top_sch af">
                        <Link to={'/NboardRegister'} className="sch_bt2 wi_au">글쓰기</Link>
                    </div>
                </div>

                <div className="list_cont list_cont_admin">
                    <table className="table_ty1 ad_tlist">
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>조회수</th>
                            <th>작성일</th>
                        </tr>
                    </table>
                    <table id="appendNboardList" className="table_ty2 ad_tlist">
                        {append_NboardList}
                    </table>
                </div>
            </article>
        </section>
    );
}

export default NewsList;