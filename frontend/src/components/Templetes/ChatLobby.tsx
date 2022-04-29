import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import ChatBoxList from "../Organisms/ChatBoxList"
import EmptyChatBox from "../Molecules/EmptyChatBox";
// import Modal from '../Atoms/Modal';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import LoginPage from './LoginPage';
import styled from "styled-components";
import { ChatLobbyTitle } from '../Atoms/Text';
import { IoMdArrowBack } from 'react-icons/io';
import Button from '../Atoms/Button';
import BackBtnNav from './BackBtnNav';
import IconButton from '../Atoms/IconButton';
import axios from 'axios';

import { loginAPI } from '../../api/accountAPI';
import { LoginInput } from '../Atoms/Inputs';
import Modal from '../Atoms/Modal';

// 채팅 목록 나열
// 안 읽은 메세지 수 출력 
// 마지막으로 보낸 메세지 출력\
// 채팅방 들어갈시 모두 읽음 처리 채팅 없을시
// 메세지 출력 : 서로 하트를 보내면 익명 채팅방이 개설됩니다! 좋아하는 사람 근처에서 하트를 보내보세요 
// 전역에서 바꿔주거나 채팅에 값이 있다 등을 삼항 연산사 등으로 나눠서 분기처리를 해야할듯

// 일단 모든 유저가 subscibe 하고 있는 곳안 하나 씩은 가지고 있고
// 로그인 하고 있을때 API 요청을 해서 내가 구독중인 채팅방 리스트를 쭉 받아 온 다음에
// 거기에 추가하는 방식으로 , DB에는 로그인 할때만 리스트를 가져오고 , 그 뒤에는 
// 메시지가 오는 대로 구독중은 채팅방 리스트를 추가하는 방식...
// A까 만약 XYZ랑 같은 채팅방을 구독중이야 한다면
// 주는대로 일단 유지하고 있다가 -> 귓속말로 너 B랑 지금 채팅방 연결됐어 하면
// 메세지를 정해서 던져주면, chatroom에서 uniqueID를 받아서
// A입장에서 메세지가 날아오면 , 이런 타입으로 메시지가 날아오면 이렇게 행동해라~
// 라고 프론트에서 로직을 짜서 어 만약 B가 왔네 ? 하면 B에 대해서면 Subscibe를 추가
// + 채팅방 리스트도 하나 만들기.
// B에 대한 채팅방 리스트도 하나 만들어주기 -> 초기에는 map을 써서 만들기 나중에는 자동으로
// 초기에 가져온걸 가지고 있따가 붙히기
// 들어온것에 대해서 자동적으로 채팅방 리스트를 만들어주기
// uniqueID

// 구독 목록 DB가 있고 채팅목록 DB가 있을텐데
// JPX 쿼리 써서 묶어주는 과정이 필요한데, 논의가 좀 필요하다.
// 힘들면 일반 쿼리로 알려달라고 해주기.

// SUBSCIBE를 API 요청으로 받아오고 있으면 
// 박스안에 리스트화 하게 

// REDUX에 사용자 데이터가 로그인 했을때 다 쌓여있을테니까 그걸 뽑아온다.
// 채팅은 최근 채팅 20~30개 제한. -> 너무 많으면 DB에서 가져오는게 힘들수도
// 리미트 걺고 완성하고, 로컬에 채팅 기록하는 식으로...

const isChatLoomExist: boolean = true;

function ChatLobbyPage () {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
  
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };


    const userIdChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserId(e.target.value);
    };
  
    const passwordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    };
  
    const loginHandler = () => {
      const loginData = {
        id: userId,
        password: password,
      };
      loginAPI(loginData)
        .then((res) => {
          console.log(res);
          navigate('/mainpage');
        })
        .catch((err) => {
          console.log(err);
        });
    };
    
    const goSignUp = () => {
      navigate('/signup/1');
    }

    if (!isChatLoomExist) {
      return (
        <EmptyChatLobby>
          <BackBtnNav
            pageTitle=''
            textColor="black"
            rightSideBtn={<IconButton imgURL="https://img.icons8.com/emoji/48/000000/robot-emoji.png" />}
            onRightBtnClick={toggleModal}
          />
          {isModalOpen && (
        <Modal
          height="300px"
          bgColor="#EEF8FF"
          padding=""
          onClickToggleModal={toggleModal}
        >
          <ModalHeader>로그인</ModalHeader>
          <LoginInput
            type="text"
            placeholder="아이디"
            value={userId}
            margin="1.5rem 0 .5rem"
            onChange={userIdChangeHandler}
          />
          <LoginInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={passwordChangeHandler}
          />
          <Button
            fontWeight="500"
            margin="1.5rem 0 .5rem"
            onClick={loginHandler}
          >
            로그인
          </Button>
          <Button fontWeight="500" bgColor="#2B65BC">
            회원가입
          </Button>
        </Modal>
      )}           
          <EmptyChatBox />
        </EmptyChatLobby>
      );
    }
    else {
      return (
        <ChatLobby>
          <BackBtnNav 
            pageTitle=""
            textColor="black"
            rightSideBtn={<IconButton imgURL="https://img.icons8.com/emoji/48/000000/robot-emoji.png" />}
            onRightBtnClick={toggleModal}
          />          
        {isModalOpen && (
        <Modal
          height="300px"
          bgColor="#EEF8FF"
          padding=""
          onClickToggleModal={toggleModal}
        >
          <ModalHeader>로그인</ModalHeader>
          <LoginInput
            type="text"
            placeholder="아이디"
            value={userId}
            margin="1.5rem 0 .5rem"
            onChange={userIdChangeHandler}
          />
          <LoginInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={passwordChangeHandler}
          />
          <Button
            fontWeight="500"
            margin="1.5rem 0 .5rem"
            onClick={loginHandler}
          >
            로그인
          </Button>
          <Button fontWeight="500" bgColor="#2B65BC" onClick={goSignUp}>
            회원가입
          </Button>
        </Modal>
      )} 
      <div>
      <ChatBoxList />
      </div>
      </ChatLobby>
    )
  }
}

const Img = styled.img`
  width: 50px;
  height: 50px;
`

const ChatLobby = styled.div`
  width: 100%;
  height: 100%;
  align-items: normal;
  background-color: #EEF8FF;
  overflow-y: auto;
`;

const EmptyChatLobby = styled.div`
  width: 100%;
  height: 100%;
  align-items: normal;
  background-color: #EEF8FF;
`;

const ModalHeader = styled.h1`
  padding-top: 0.5rem;
  font-weight: 700;
  font-size: 1.3rem;
`;


export default ChatLobbyPage;

