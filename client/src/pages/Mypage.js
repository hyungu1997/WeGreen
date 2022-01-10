import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserinfo } from "../actions";
import { requestMyinfo } from "../apis";
import styled from "styled-components";
import { color, device, contentWidth, boxShadow } from "../styles";
import Illust from "../components/Illust";
import UserProfile from "../components/UserProfile";
import Tab from "../components/Tab";
import ChallengeCard from "../components/ChallengeCard";


const Container = styled.div`
  @media ${device.laptop} {
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${color.primaryLight};
  }
`;

const MypageContainer = styled.div`
  background-color: ${color.white};

  @media ${device.laptop} {
    display: grid;
    grid-template-columns: 2fr 1fr;
    width: ${contentWidth};
    height: 100%;
    box-shadow: ${boxShadow};
  }
`;

const MyChallengesContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`;

const ChallengeListContainer = styled.div`
  width: 100%;
  padding: 1rem;
`;

const ChallengeList = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  text-align: center;
  font-weight: bold;

  @media ${device.mobileLandscape} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${device.laptop} {
    grid-template-columns: 1fr;
  }
`;

const EmptyMessage = styled.p`
  color: ${color.primary};
  font-size: 3rem;
  text-align: center;
  word-break: keep-all;
`;

const Mypage = () => {
  const [view, setView] = useState("ongoing");

  const [challenges, setChallenges] = useState([{}])

  const state = useSelector((state) => state.userReducer);
  const myinfo = state.userInfo

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.isLogin) {
      navigate('/login')
    } else {
      requestMyinfo(`${myinfo.user_id}`).then(result => {
        setChallenges(result.challenge_info.challenges)
        const data = result.user_info
        dispatch(updateUserinfo(data))
      })
    }
  // eslint-disable-next-line
  }, [])

  const ongoingChallenges = challenges.filter(el => el.is_finished === false)
  const finishedChallenges = challenges.filter(el => el.is_finished === true)

  const successCounts = challenges
                          .filter(el => el.is_finished === true && el.is_accomplished === true).length

  const tabContent = {
    ongoing: (
      <>
        {ongoingChallenges.length === 0 ?
          <EmptyMessage>
            참여중인<br />챌린지가<br />없습니다
          </EmptyMessage>
          :
          <ChallengeList> 
            {ongoingChallenges.map((el) => (
              <ChallengeCard 
                challenge={el}
                key={el.challenge_id}  
              />              
            ))}
          </ChallengeList>
        }
      </>
    ),
    finished: (
      <>
        {finishedChallenges.length === 0 ?
          <EmptyMessage>
            완료된<br />챌린지가<br />없습니다
          </EmptyMessage>
          :
          <ChallengeList> 
            {finishedChallenges.map((el) => (
              <ChallengeCard 
                challenge={el}
                key={el.challenge_id}  
              />              
            ))}
          </ChallengeList>
        }
      </>
    ),
  };

  return (
    <Container>
      <MypageContainer>
        <Illust />
        <MyChallengesContainer>
          <UserProfile
            userInfo={myinfo}
            successCounts={successCounts}
          />
          <Tab
            tabInfo={[
              ["ongoing", "참여중인 챌린지"],
              ["finished", "완료된 챌린지"],
            ]}
            handleView={setView}
          />
          <ChallengeListContainer>
            {tabContent[view]}    
          </ChallengeListContainer>
        </MyChallengesContainer>
      </MypageContainer>
    </Container>
  );
};

export default Mypage;
