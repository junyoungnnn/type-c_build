// Header.tsx

import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const Nav = styled(motion.nav)`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 좌우 끝으로 배치 */
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
  background-color: rgba(0, 0, 0, 1);
  z-index: 10;

  @media (max-width: 480px) {
    padding: 10px 20px;
  }
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const HighlightedText = styled.span`
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin-right: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-right: 10px;
  }
`;

interface ItemsProps {
  menuOpen: boolean;
}

const Items = styled.ul<ItemsProps>`
  display: flex;
  align-items: center;
  margin-left: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    background-color: rgba(0, 0, 0, 0.9);
    position: fixed;
    z-index: 9;
    top: 45px; /* 메뉴 아이콘과 겹치지 않도록 조정 */
    left: 0;
    width: 100%;
    padding: 10px 20px;
    display: ${(props) => (props.menuOpen ? "flex" : "none")};
    margin-left: 0;
  }
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;

  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }

  @media (max-width: 480px) {
    margin: 10px 0;
  }
`;

const MenuIcon = styled.div`
  display: none;
  cursor: pointer;

  svg {
    fill: white;
    width: 24px;
    height: 24px;
  }

  @media (max-width: 480px) {
    display: block;
  }
`;

const Search = styled.div`
  color: white;
  display: flex;
  align-items: center;
  position: relative;

  svg {
    height: 25px;
  }

  @media (max-width: 480px) {
    display: none; /* 모바일에서 검색 아이콘 숨김 */
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const Select = styled(motion.select)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  padding-left: 10px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
  appearance: none;

  option {
    color: black;
  }
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  scroll: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
};

const sites = [
  { name: "경제/인문사회연구회", url: "https://www.nrc.re.kr/index.es?sid=a1" },
  // 다른 사이트들...
];

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 모바일 메뉴 상태
  const homeMatch = useRouteMatch("/");
  const newsMatch = useRouteMatch("/news");
  const contactMatch = useRouteMatch("/contact");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();

  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);

  const [selectedSite, setSelectedSite] = useState("");

  const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = event.target.value;
    if (selectedUrl) {
      window.open(selectedUrl, "_blank");
      setSelectedSite(""); // 선택 후 초기화
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Nav variants={navVariants} animate={navAnimation} initial={"top"}>
      {/* 왼쪽 영역: 로고와 메뉴 아이템들 */}
      <Col>
        <Link to="/">
          <HighlightedText>TYPE-C</HighlightedText>
        </Link>
        {(!isMobile || menuOpen) && (
          <Items menuOpen={menuOpen}>
            <Item onClick={handleMenuItemClick}>
              <Link to="/">
                Home {homeMatch?.isExact && <Circle layoutId="circle" />}
              </Link>
            </Item>
            <Item onClick={handleMenuItemClick}>
              <Link to="/news">
                News {newsMatch && <Circle layoutId="circle" />}
              </Link>
            </Item>
            <Item onClick={handleMenuItemClick}>
              <Link to="/contact">
                Contact {contactMatch && <Circle layoutId="circle" />}
              </Link>
            </Item>
          </Items>
        )}
      </Col>
      {/* 모바일에서 메뉴 아이콘 표시 */}
      {isMobile && (
        <MenuIcon onClick={toggleMenu}>
          <svg viewBox="0 0 100 80" width="30" height="30">
            <rect width="100" height="10"></rect>
            <rect y="30" width="100" height="10"></rect>
            <rect y="60" width="100" height="10"></rect>
          </svg>
        </MenuIcon>
      )}
      {/* 데스크톱에서의 검색 아이콘 */}
      {!menuOpen && !isMobile && (
        <Search>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: 0 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8z
              M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1
              0 01-1.414 1.414l-4.816-4.816A6 6 0
              012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Select
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
            value={selectedSite}
            onChange={handleSiteChange}
          >
            <option value="">관련 사이트...</option>
            {sites.map((site) => (
              <option key={site.url} value={site.url}>
                {site.name}
              </option>
            ))}
          </Select>
        </Search>
      )}
    </Nav>
  );
}

export default Header;
