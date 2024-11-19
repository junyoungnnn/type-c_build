import styled from "styled-components";

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  margin-top: 0px;

  @media (max-width: 768px) {
    padding: 15px 0;
  }

  @media (max-width: 480px) {
    padding: 10px 0;
  }
`;

const FooterText = styled.p`
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

function Footer() {
  return (
    <FooterWrapper>
      <FooterText>
        &copy; 2024 수산물 가격 예측. All rights reserved.
      </FooterText>
    </FooterWrapper>
  );
}

export default Footer;
