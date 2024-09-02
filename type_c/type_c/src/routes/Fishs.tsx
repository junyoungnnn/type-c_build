import styled from "styled-components";
import { Link } from "react-router-dom";
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
  width: 20%;
  height: 20%;
`;

const FishsList = styled.ul``;

const Fish = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 20px;
  border: 1px solid black;
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
    text-decoration: none; /* 기본 링크 스타일 제거 */
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

interface IFishList {
  data: IData[];
}

interface IData {
  fishName: string;
  fishId: number;
}

interface IForm {
  searchFishName: string;
}

function Fishs() {
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const isDarkMode = useRecoilValue(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  const { isLoading: fishListLoading, data: fishListData } =
    useQuery<IFishList>("allFishs", fetchFishList);

  const endDate = useRecoilValue(endDateAtom);
  const startDate = useRecoilValue(oneWeekDateAtom);
  const oneMonthLast = useRecoilValue(oneMonthLastAtom);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();

  const onValid = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <Helmet>
        <title>수산물 가격 예측</title>
      </Helmet>
      <Header>
        <Nav>
          <HighlightedText>Type-C</HighlightedText>
          <Link to={`/type-c_build`}>Home</Link>
          <Link to={"/news"}>News</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </Nav>
        {/* 아이콘이 포함된 버튼 */}
        <button onClick={toggleDarkAtom}>
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </Header>
      <Container>
        <Title>수산물 가격 예측</Title>
        {fishListLoading ? (
          <Loader>"Loading..."</Loader>
        ) : (
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
                    alt={`${item.fishName}이미지`}
                  />
                  {item.fishName} &rarr;
                </Link>
              </Fish>
            ))}
          </FishsList>
        )}
      </Container>
      <Footer>
        <p>&copy; 2024 수산물 가격 예측. All rights reserved.</p>
      </Footer>
    </>
  );
}

export default Fishs;
