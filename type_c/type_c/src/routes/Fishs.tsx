import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchFishList } from "./api";
import { useQuery } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { endDateAtom, oneMonthLastAtom, oneWeekDateAtom } from "../atom";
import { useForm } from "react-hook-form";
import { FaSun, FaMoon } from "react-icons/fa"; // sun과 moon 아이콘 가져오기
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useWindowDimensions from "../Components/useWidowDimensions";

// Styled Components
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.white.lighter};
  padding-bottom: 200px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  background-size: cover;
  background-position: center;
  height: 200px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 66px;
  border-radius: 15px;
  display: flex; /* Flex 컨테이너 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 수직 중앙 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  position: relative; /* Info 위치를 절대 위치로 설정 */
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  justify-content: center; /* 텍스트 중앙 정렬 */
  h4 {
    text-align: center;
    font-size: 18px;
    margin: 0; /* 여백 제거 */
  }
`;

const FishImage = styled.img`
  width: 60%; /* 이미지 크기 조정 */
  height: 60%; /* 이미지 크기 조정 */
  object-fit: contain; /* 이미지 비율 유지 */
  border-radius: 15px;
  margin-bottom: 10px; /* 이미지와 텍스트 간 간격 */

  @media (max-width: 768px) {
    width: 80%;
    height: 80%;
  }
`;

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.4,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.3,
      type: "tween",
    },
  },
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Banner = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.75)),
    url(${process.env.PUBLIC_URL}/backgroundimg.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const HighlightedText = styled.span`
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin-right: 20px;
`;

const FishImg = styled.img`
  width: 75px;
  height: 75px;
`;

const FishsList = styled.ul``;

const Fish = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 20px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
    text-decoration: none;
    width: 100%;
    height: 100%;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.white.darker};
  text-align: center;
  margin-top: 20px; /* 필요에 따라 조정 */
  margin-bottom: 40%;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const SelectContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* select와 button 사이의 간격 */
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  width: 100%;
  max-width: 300px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.accentColor};
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.accentColor};
    color: white;
  }
`;

interface IFishList {
  data: IData[];
}

interface IData {
  fishName: string;
  fishId: number;
}

const offset = 6;

function Fishs() {
  const width = useWindowDimensions();
  const { isLoading: fishListLoading, data: fishListData } =
    useQuery<IFishList>("allFishs", fetchFishList);

  const [selectedFish, setSelectedFish] = useState<string>("");

  const history = useHistory();

  const handleFishChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFish(event.target.value);
  };

  const handleNavigate = () => {
    if (selectedFish) {
      history.push({
        pathname: `/${selectedFish}`,
        state: { fishName: selectedFish },
      });
    }
  };

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (fishListData) {
      if (leaving) return;
      toggleLeaving();
      const totalFishs = fishListData?.data.length - 1;
      const maxIndex = Math.floor(totalFishs / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <>
      <Helmet>
        <title>수산물 가격 예측</title>
      </Helmet>
      <Wrapper>
        {/* <Container> */}
        <Banner onClick={incraseIndex}>
          <Title>수산물 가격 예측</Title>
        </Banner>
        {fishListLoading ? (
          <Loader>"Loading..."</Loader>
        ) : (
          <>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  initial={{ x: width + 10 }}
                  animate={{ x: 0 }}
                  exit={{ x: -width - 10 }}
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {fishListData?.data
                    .slice(offset * index, offset * index + offset)
                    .map((f) => (
                      <Box
                        layoutId={f.fishName + ""}
                        key={f.fishName}
                        variants={BoxVariants}
                        whileHover="hover"
                        initial="normal"
                        transition={{ type: "tween" }}
                        onClick={() =>
                          history.push({
                            pathname: `/${f.fishName}`,
                            state: { fishName: f.fishName },
                          })
                        }
                        role="button" // 접근성을 위해 버튼 역할 지정
                        tabIndex={0} // 키보드 접근 가능하도록 설정
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            history.push({
                              pathname: `/${f.fishName}`,
                              state: { fishName: f.fishName },
                            });
                          }
                        }}
                      >
                        <FishImage
                          src={`${process.env.PUBLIC_URL}/${f.fishName}.png`}
                          alt={`${f.fishName} 이미지`}
                        />
                        <Info variants={infoVariants}>
                          <h4>{f.fishName}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Fishs;
