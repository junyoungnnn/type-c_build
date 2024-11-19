import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchFishList } from "./api";
import { useQuery } from "react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useWindowDimensions from "../Components/useWidowDimensions";

// Styled Components
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.white.lighter};
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const Slider = styled.div`
  position: relative;
  top: -350px;
  width: 90%;
  margin: 0 auto;

  @media (max-width: 768px) {
    top: -280px;
  }
`;

// 수정된 Row 컴포넌트
const Row = styled(motion.div)`
  bottom: -200px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr); // 모바일에서 두 줄로 설정
  }

  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  background-size: cover;
  background-position: center;
  height: 200px;
  color: ${(props) => props.theme.black.veryDark};
  font-size: 66px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 2px solid black;
  z-index: 0;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }

  @media (max-width: 768px) {
    height: 150px;
    font-size: 48px;
  }

  @media (max-width: 480px) {
    height: 120px;
    font-size: 36px;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: transparent;
  opacity: 1;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  justify-content: center;
  h4 {
    text-align: center;
    font-size: 18px;
    margin: 0;
  }

  @media (max-width: 768px) {
    h4 {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    h4 {
      font-size: 14px;
    }
  }
`;

const FishImage = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
  border-radius: 15px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    width: 70%;
    height: 70%;
  }

  @media (max-width: 480px) {
    width: 80%;
    height: 80%;
  }
`;

const BoxVariants = {
  normal: {
    scale: 1,
    zIndex: 0, // 기본 상태에서는 낮은 zIndex
  },
  hover: {
    scale: 1.3,
    y: -50,
    zIndex: 1, // 호버 시 높은 zIndex로 설정
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

// Styled Components
const FishGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, auto);
  gap: 10px;
  margin-top: 50px;
  padding: 50px 20px 0 20px; /* 위쪽 패딩을 50px로 설정 */
  width: 80%; /* 너비를 80%로 설정 */
  margin: 0 auto; /* 가로 중앙 정렬 */

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, auto);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(10, auto);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(14, auto);
  }
`;

const GridItem = styled.div`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.blue.darker};
    color: white;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.blue.darker};
  }
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

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.white.darker};
  text-align: center;
  margin-top: 20px;
  margin-bottom: 40%;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 70%;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 70%;
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

interface IFishList {
  data: IData[];
}

interface IData {
  fishName: string;
  fishId: number;
}

function Fishs() {
  const width = useWindowDimensions();
  const isMobile = width <= 768;
  const offset = isMobile ? 4 : 5;
  const totalSlides = 10;

  const { isLoading: fishListLoading, data: fishListData } =
    useQuery<IFishList>("allFishs", fetchFishList);

  const history = useHistory();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const incraseIndex = () => {
    if (!fishListData) return;

    if (leaving) return;
    toggleLeaving();

    const totalFishs = fishListData.data.length;
    const maxIndex = Math.ceil(totalFishs / offset);

    setIndex((prev) => (prev + 1) % totalSlides);
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  // 수정된 getSlideData 함수
  const getSlideData = (data: IData[], index: number, offset: number) => {
    const totalData = data.length;
    const result = [];
    const start = index * offset;

    for (let i = start; i < start + offset; i++) {
      result.push(data[i % totalData]);
    }
    return result;
  };

  return (
    <>
      <Helmet>
        <title>수산물 가격 예측</title>
      </Helmet>
      <Wrapper>
        <Banner onClick={incraseIndex}>
          <Title>수산물 가격 예측</Title>
        </Banner>
        {fishListLoading || !fishListData ? (
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
                  {getSlideData(fishListData.data, index, offset).map((f) => (
                    <Box
                      layoutId={f.fishName + index}
                      key={f.fishName + index}
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
                      role="button"
                      tabIndex={0}
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

            {/* FishGrid는 그대로 유지 */}
            <FishGrid>
              {fishListData.data.map((f) => (
                <GridItem
                  key={f.fishName}
                  onClick={() =>
                    history.push({
                      pathname: `/${f.fishName}`,
                      state: { fishName: f.fishName },
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      history.push({
                        pathname: `/${f.fishName}`,
                        state: { fishName: f.fishName },
                      });
                    }
                  }}
                >
                  {f.fishName}
                </GridItem>
              ))}
            </FishGrid>
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Fishs;
