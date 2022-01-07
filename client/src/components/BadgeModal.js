import { useState } from 'react';
import styled from 'styled-components';
import { color, device, radius } from '../styles';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background-color: ${color.backdrop};
`;

const BadgeModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
  display: flex;
  width: 320px;
  height: 540px;
  flex-direction: column;
  padding: 1rem;
  background-color: white;
  border-radius: ${radius};
  text-align: center;

  @media ${device.laptop} {
    width: 440px;
  }
`;

const BadgesViewer = styled.div`
  padding: 1rem;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media ${device.laptop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const BadgeType = {
  absent: '',
  unselected: '1px dashed black',
  selected: '1px solid black',
};

const Badge = styled.img`
  width: 80px;
  height: 80px;
  border: ${(props) => props.border};
  border-width: ${(props) => props.isMain};
  border-radius: 40px;
`;

const CloseBtn = styled.button`
  position: relative;
  align-self: flex-end;
  width: 20px;
  height: 20px;
  background-color: transparent;
  text-indent: -999px;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 9px;
    left: 0;
    width: 20px;
    height: 2px;
    border-radius: 1px;
    background-color: ${color.primaryBorder};
    transform: rotate(45deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 9px;
    left: 0;
    width: 20px;
    height: 2px;
    border-radius: 1px;
    background-color: ${color.primaryBorder};
    transform: rotate(-45deg);
  }
`;

const BadgeModal = ({ closeModal }) => {
  const dummyTotalBadges = [
    { id: 1, src: 'src' },
    { id: 2, src: 'src' },
    { id: 3, src: 'src' },
    { id: 4, src: 'src' },
    { id: 5, src: 'src' },
    { id: 6, src: 'src' },
    { id: 7, src: 'src' },
    { id: 8, src: 'src' },
    { id: 9, src: 'src' },
  ];
  const badges = [1, 2, 3, 5, 8];
  const badge_id = 2;

  const arranged = [...dummyTotalBadges];
  arranged.forEach((el, idx) => {
    if (badges.includes(idx + 1)) {
      if (idx + 1 === badge_id) {
        el.type = 'selected';
      } else {
        el.type = 'unselected';
      }
    } else {
      el.type = 'absent';
    }
  });

  const [badgeInfo, setbadgeInfo] = useState(arranged);

  const handleMainBadge = (e) => {
    let idx = Number(e.target.alt);
    if (!badges.includes(idx)) {
      return;
    }
    const selectedBadges = badgeInfo
      .filter((el) => el.type === 'selected')
      .map((el) => el.id)[0];

    if (selectedBadges === idx) {
    } else {
      const change = [...badgeInfo];
      change[idx - 1] = Object.assign({}, badgeInfo[idx - 1], {
        id: idx,
        type: 'selected',
      });
      change[selectedBadges - 1] = Object.assign({}, badgeInfo[idx - 1], {
        id: selectedBadges,
        type: 'unselected',
      });
      setbadgeInfo(change);
    }
  };
  console.log(badgeInfo)

  return (
    <>
      <Backdrop></Backdrop>
      <BadgeModalContainer>
        <CloseBtn onClick={() => closeModal(false)}>close</CloseBtn>
        <BadgesViewer>
          {badgeInfo.map((el, idx) => {
            return (
              <Badge
                key={el.id}
                src={el.src}
                alt={el.id}
                border={BadgeType[el.type]}
                onClick={handleMainBadge}
              />
            );
          })}
        </BadgesViewer>
      </BadgeModalContainer>
    </>
  );
};

export default BadgeModal;
