import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchFishList } from "./api";
import { useQuery } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  endDateAtom,
  isDarkAtom,
  oneMonthLastAtom,
  oneWeekDateAtom,
} from "../atom";
import { useForm } from "react-hook-form";
import { FaSun, FaMoon } from "react-icons/fa"; // sun과 moon 아이콘 가져오기
import { useState } from "react";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 680px;
  margin: 0 auto;
`;

const Header = styled.header`
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: black;
  color: white;
  position: relative;
  left: 0;
  top: 0;
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px;
  a {
    text-decoration: none;
    color: white;
    font-weight: bold;
  }
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
  color: ${(props) => props.theme.accentColor};
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Footer = styled.footer`
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  margin-top: 20px;
  position: relative;
  left: 0;
  bottom: 0;
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

function Fishs() {
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const isDarkMode = useRecoilValue(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  const { isLoading: fishListLoading, data: fishListData } =
    useQuery<IFishList>("allFishs", fetchFishList);

  const [selectedFish, setSelectedFish] = useState<string>("");

  const history = useHistory();

  const handleFishChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFish(event.target.value);
  };

  const handleNavigate = () => {
    if (selectedFish) {
      history.push(`/${selectedFish}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>수산물 가격 예측</title>
      </Helmet>
      <Header>
        <Nav>
          <HighlightedText>Type-C</HighlightedText>
          <Link to={`/`}>Home</Link>
          <Link to={"/news"}>News</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </Nav>
        <button onClick={toggleDarkAtom}>
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </Header>
      <Container>
        <Title>수산물 가격 예측</Title>
        {fishListLoading ? (
          <Loader>"Loading..."</Loader>
        ) : (
          <>
            {/* Select Dropdown */}
            <SelectContainer>
              <Select onChange={handleFishChange} value={selectedFish}>
                <option value="">수산물을 선택하세요</option>
                {fishListData?.data.map((item) => (
                  <option key={item.fishId} value={item.fishName}>
                    {item.fishName}
                  </option>
                ))}
              </Select>
              <Button onClick={handleNavigate}>Go</Button>
            </SelectContainer>
            <FishsList>
              {fishListData?.data.map((item, index) => (
                <Fish key={index}>
                  <Link
                    to={{
                      pathname: `/${item.fishName}`,
                      state: {
                        fishName: item.fishName,
                      },
                    }}
                  >
                    <FishImg
                      src={`${process.env.PUBLIC_URL}/${item.fishName}.png`}
                      alt={`${item.fishName} 이미지`}
                    />
                    {item.fishName} &rarr;
                  </Link>
                </Fish>
              ))}
            </FishsList>
          </>
        )}
      </Container>
      <Footer>
        <p>&copy; 2024 수산물 가격 예측. All rights reserved.</p>
      </Footer>
    </>
  );
}

export default Fishs;
