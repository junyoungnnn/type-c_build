import styled from "styled-components";

const FooterWrapper = styled.footer`
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  margin-top: 0px;
`;

function Footer() {
  return (
    <FooterWrapper>
      <p>&copy; 2024 수산물 가격 예측. All rights reserved.</p>
    </FooterWrapper>
  );
}

export default Footer;
