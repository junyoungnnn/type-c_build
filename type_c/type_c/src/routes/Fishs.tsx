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
  overflow-x: hidden; /* 가로 오버플로우 숨기기 추가 */
`;

const Slider = styled.div`
  position: relative;
  top: -300px;
  width: 90%; /* 너비를 80%로 설정 */
  margin: 0 auto; /* 가로 중앙 정렬 */
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
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
`;

const FishImage = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
  border-radius: 15px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
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
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(6, auto);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
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

const offset = 5;

function Fishs() {
  const width = useWindowDimensions();
  const { isLoading: fishListLoading, data: fishListData } =
    useQuery<IFishList>("allFishs", fetchFishList);

  const history = useHistory();

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

            {/* New Grid Section */}
            <FishGrid>
              {fishListData?.data.map((f) => (
                <GridItem
                  key={f.fishName}
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
