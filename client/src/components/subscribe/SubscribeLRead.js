import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';
import Modal from 'react-modal';

const SubscribeLRead = (props) => {
    const { sno } = useParams();

    const [title, setTitle] = useState('');
    const [spoint, setSpoint] = useState('');
    const [content, setContent] = useState('');
    const [writer, setWriter] = useState('');
    const [mno, setMno] = useState('');
    const [ruuid, setRuuid] = useState(cookie.load('uuid'));
    const [rmno, setRmno] = useState('');
    const [viewCnt, setViewCnt] = useState('');
    const [regidate, setRegidate] = useState('');
    const [imageDTOList, setImageDTOList] = useState([]);
    const [mainImage, setMainImageList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [append_ReplyList, setAppend_ReplyList] = useState([]);
    const [responseReplyList, setResponseReplyList] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [selectRno, setSelectRno] = useState('');


    useEffect(() => {
        callMemberInfoApi();
        callNboardInfoApi();
        callReplyListApi(sno);
    }, [])

    const callMemberInfoApi = () => {
        // 1. 쿠키에서 토큰 가져오기 
        const token = cookie.load('token');

        // 2. token을 서버로 보내고 uuid를 받아오기
        axios.post(`/member/loginCookie`, {
            token: token
        }).then(response => {
            const uuid = response.data.uuid;
            
            try {
                const data = response.data.vo;
                setRuuid(data.UUID);      // 회원 아이디
                setRmno(data.MNO);        // 회원 번호
            } catch (error) {
                alert('회원데이터를 읽어오는 중에 오류가 발생했습니다.');
            }
        }).catch(error => { alert('회원데이터 받기 오류2'); return false; });
    };

    const callNboardInfoApi = async () => {
        axios.get(`/subscribe/subscribeLessionRead/${sno}`, {
        }).then(response => {
            try {
                setTitle(response.data.title);
                setSpoint(response.data.spoint);
                setContent(response.data.contents);
                setWriter(response.data.uuid);
                setMno(response.data.mno);
                setViewCnt(response.data.counts);
                setRegidate(response.data.wdate);
                setImageDTOList(response.data.imageDTOList);
                setMainImageList(response.data.mainImage);
            }
            catch (error) {
                alert('게시글데이터 받기 오류')
            }
        }).catch(error => { alert('게시글데이터 받기 오류2'); return false; });
    }

    const handleThumbnailClick = (thumbnailURL) => {
        setModalIsOpen(true);
        setSelectedImage(thumbnailURL);
    };

    const closeImageModal = () => {
        setModalIsOpen(false);
        setSelectedImage('');
    };

    const renderImages = () => {
        const imageList = imageDTOList;
        
        return imageList.map((images, index) => (
            <li className="hidden_type" key={index}>
                {images.imgType == 'A' ?
                    <img src={`/subscribe/display?fileName=${images.imgName}`}
                    alt={`썸네일 ${index}`}
                    onClick={() => handleThumbnailClick(images.imageURL)} /> 
                    : ''
                }
            </li>
        ));
    };
        
    const renderMainImages = () => {
        const mainImgList = mainImage;

        return mainImgList.map((image, index) => (
            <li className="hidden_type1" key={index}>
                {image.imgType == 'M' ?
                    <img src={`/subscribe/display?fileName=${image.imgName}`}
                    alt={`썸네일 ${index}`}
                    onClick={() => handleThumbnailClick(image.imageURL)} />
                 : ''
                }
            </li>
        ));
    };

    const deleteArticle = (e) => {
        sweetalertDelete1('삭제하시겠습니까?', () => {
            axios.delete(`/subscribe/subscribeLessionDelete/${sno}`, {
                // sno: sno
            }).then(response => {
            }).catch(error => {
                alert('작업중 오류가 발생하였습니다.'); return false;
            });
        })
    };

    const sweetalertDelete1 = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    '삭제되었습니다.',
                    '',
                    'success'
                ).then(() => {
                    window.location.href = '/SubscribeLList';
                });
            } else {
                return false;
            }
            callbackFunc();
        })
    }

    const submitClick = (e) => {
        const reply_checker = $('#replyTextVal').val();

        const fnValidate = (e) => {
            if (reply_checker === '') {
                $('#replyTextVal').addClass('border_validate_err');
                sweetalert('댓글내용을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#replyTextVal').removeClass('border_validate_err');
            return true;
        }

        if (fnValidate()) {
            let jsonstr = $("form[name='frm2']").serialize();

            jsonstr = decodeURIComponent(jsonstr);
            let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            let Json_data = JSON.parse(Json_form);

            axios.post('/sreplies/add', Json_data)
                .then(response => {
                    try {
                        if (response.data == "SUCCESS") {
                            callReplyListApi(sno);
                            $('#replyTextVal').val('')
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.')
                    }
                }).catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
        }
    };

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }
    
    const callReplyListApi = (sno) => {
        axios.get(`/sreplies/list/${sno}`)
        .then(response => {
            try {
                    setResponseReplyList(response);
                    setAppend_ReplyList(ReplyListAppend(response.data));
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    }

    const ReplyListAppend = (replyList) => {
        let result = []
        const currentUser = '111';

        for (let i = 0; i < replyList.length; i++) {
            let data = replyList[i]
            const isCurrentUserCommentOwner = true;
            // const isCurrentUserCommentOwner = data.replyer === currentUser;

            result.push(
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '19px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '80px' }}>
                            <img src={require(`../../img/reply2.gif`)} alt="댓글 이미지" />
                        </div>
                        <div className="cat">
                            <p style={{ fontSize: '19px' }}>
                                {data.replyer}
                                <span style={{ fontSize: '12px' }}>
                                    <span style={{ marginLeft: '5px', color: 'grey' }}></span>
                                    <span style={{ fontSize: '10px', color: 'grey' }}></span>
                                </span>
                            </p>
                            <p style={{ color: '#525252' }}>{data.rcomment}
                                {/* <input type="text" value={data.rcomment} style={{ flex: '1', marginRight: '8px', height: '50px' }} /> */}
                            </p>
                        </div>
                    </div>
                    <div>
                        {isCurrentUserCommentOwner && (
                            <div>
                                <button className="catbtn bt_ty2 submit_ty1 saveclass" onClick={() => modifyComment(`${data.rno}`, `${data.rcomment}`)}>수정</button>
                                <button className="catbtn bt_ty2 submit_ty1 saveclass" onClick={() => deleteComment(`${data.rno}`)}>삭제</button>
                            </div>
                        )}
                    </div>
                </li>
            );
        }
        return result
    }

    const deleteComment = (rno) => {
        sweetalertDelete2('삭제하시겠습니까?', () => {
            axios.delete(`/sreplies/delete/${rno}`, {
            }).then(response => {
                if (response.data == "SUCCESS") {
                    callReplyListApi(sno);
                }
            }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        })
    };

    const sweetalertDelete2 = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                callbackFunc();
                //callReplyListApi(sno);
            } else {
                return false;
            }
        })
    }

    const modifyComment = (rno, rco) => {
        setIsEditModalOpen(true);
        setSelectRno(rno);
        setEditedContent(rco);
    };

    const openEditModal = (rno) => {
        this.setState({
            selectRno: rno,
            isEditModalOpen: true,
            editedContent: rno,
        });
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditedContent('');
    };

    const handleEditSubmit = () => {
        axios.put(`/sreplies/update/${selectRno}`, {
            rno: selectRno,
            rcomment: editedContent,
        }).then(response => {
            if (response.data == "SUCCESS") {
                setIsEditModalOpen(false);
                callReplyListApi(sno);
            }
        }).catch(error => { alert('댓글수정오류'); return false; });
    };

    const formattedRegidate = new Date(regidate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('.').join('/').replace(/\s/g, '');

    const trimmedRegidate = formattedRegidate.slice(0, -1);

    return (
        <section class="sub_wrap">
            <article class="s_cnt mp_pro_li ct1">
                <div class="li_top">
                    <h2 class="s_tit1">강의수강</h2>
                </div>
                <div class="bo_w re1_wrap re1_wrap_writer">
                    <form name="frm" id="frm" action="" onsubmit="" method="post" >
                        <article class="res_w">
                            <div class="tb_outline">
                                <div style={{ textAlign: "Right" }}>
                                    <Link to={`/SubscribeLList`} className="bt_ty bt_ty2 submit_ty1 saveclass">목록</Link>
                                </div>
                                <table class="table_ty1">
                                    <tr>
                                        <th>
                                            대표이미지
                                        </th>
                                        <td className="fileBox fileBox1">
                                            <ul id="upload_mainimg">
                                                {renderMainImages()}
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="title">강의제목</label>
                                        </th>
                                        <td>
                                            <input type="text" name="title" id="titleVal" readOnly="readonly" value={title} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="spoint">수강료</label>
                                        </th>
                                        <td>
                                            <input type="text" name="spoint" id="spointVal" readOnly="readonly" value={spoint} />
                                        </td>
                                    </tr>
                                </table>
                                <table class="table_ty1">
                                    <tr>
                                        <th>
                                            <label for="writer">강의등록</label>
                                        </th>
                                        <td>
                                            <input type="text" name="writer" id="writerVal" readOnly="readonly" value={writer} />
                                        </td>

                                        <th style={{ textAlign: "center" }}>
                                            <label for="regDate">등록일</label>
                                        </th>
                                        <td>
                                            <input type="text" name="regiDate" id="regiDateVal" readOnly="readonly" value={trimmedRegidate} />
                                        </td>

                                        <th style={{ textAlign: "center" }}>
                                            <label for="writer">조회수</label>
                                        </th>
                                        <td>
                                            <input type="text" name="viewCnt" id="viewCntVal" readOnly="readonly" value={viewCnt} />
                                        </td>
                                    </tr>
                                </table>
                                <table class="table_ty1">
                                    <tr>
                                        <th>
                                            <label for="Content">강의내용</label>
                                        </th>
                                        <td>
                                            <textarea style={{ padding: '15px' }} name="content" id="contentVal" rows="" cols="" readOnly="readonly" value={content}></textarea>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            파일목록
                                        </th>
                                        <td className="fileBox fileBox1">
                                            <ul id="upload_img">
                                                {renderImages()}
                                            </ul>
                                        </td>
                                    </tr>
                                    
                                    <Modal
                                        ariaHideApp={false}
                                        isOpen={modalIsOpen}
                                        onRequestClose={closeImageModal}
                                        contentLabel="썸네일 이미지"
                                        style={{
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                            },
                                            content: {
                                                width: '75%',
                                                height: '75%',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                overflow: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }}>
                                        {selectedImage && (
                                            <img src={`/subscribe/display?fileName=${selectedImage}`} alt="선택한 썸네일" />
                                        )}
                                    </Modal>
                                </table>
                                <div id="modifyButton" class="btn_confirm mt20" style={{ "margin-bottom": "44px", textAlign: "center" }}>
                                    <Link to={`/SubscribeLUpdate/${sno}`} className="bt_ty bt_ty2 submit_ty1 saveclass">수정</Link>
                                    <a href='javascript:' className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={(e) => deleteArticle(e)}>삭제</a>
                                </div>
                            </div>
                        </article>
                    </form>

                    <div className='table_ty99'>댓글</div>
                    <form name="frm2" id="frm2" action="" onsubmit="" method="post">
                        <div className='line'></div>
                        <table class="table_ty1">
                            <tr id='snoDiv'>
                                <td>
                                    <input type="text" name="sno" id="snoVal" value={sno} />
                                </td>
                            </tr>
                            <tr id='replyerDiv'>
                                <td>
                                    <input type="text" name="uuid" id="replyerVal" value={ruuid} />
                                    <input type="hidden" name="mno" id="replyerVal" value={rmno} />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ display: 'flex', alignItems: 'center' }}>
                                    <input type="text" name="rcomment" id="replyTextVal" placeholder='내용을 입력해주세요.' style={{ flex: '1', marginRight: '8px', height: '50px' }} />
                                    <a href="javascript:" className="bt_ty1 bt_ty3 submit_ty1 saveclass" onClick={(e) => submitClick(e)}>등록</a>
                                </td>
                            </tr>
                        </table>
                    </form>
                    <div id='replyarea'>
                        <ul>
                            {append_ReplyList}
                        </ul>
                    </div>
                </div>

                <Modal
                    ariaHideApp={false}
                    isOpen={isEditModalOpen}
                    onRequestClose={closeEditModal}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        content: {
                            width: '30%',
                            height: '30%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white'
                        }
                    }}>
                    <div id="replyDiv">
                        <h2>댓글 수정</h2>
                        <br></br>
                        <input style={{ height: '30%', width: '80%', padding: '15px' }}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)} ></input>
                        <br></br>
                        <div style={{ display: 'flex' }}>
                            <button className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={handleEditSubmit}>저장</button>
                            <button className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={closeEditModal}>취소</button>
                        </div>
                    </div>
                </Modal>
            </article>
        </section>
    );
}

export default SubscribeLRead;