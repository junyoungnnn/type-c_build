import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
  padding: 50px 20px;
  max-width: 800px;
  margin: 0 auto;
  color: ${(props) => props.theme.black.darker};
`;

const Title = styled.h1`
  font-size: 36px;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
  color: ${(props) => props.theme.black.darker};
`;

const AddressSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: ${(props) => props.theme.black.darker};
`;

const Address = styled.p`
  line-height: 1.6;
  font-size: 18px;
`;

const MapContainer = styled.div`
  margin-top: 50px;
  text-align: center;
`;

function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us</title>
      </Helmet>
      <Container>
        <Title>Contact Us</Title>
        <AddressSection>
          <SectionTitle>Address</SectionTitle>
          <Address>
            부산광역시 남구 용소로 45, 부경대학교 대연캠퍼스 웅비관(A12) 1309호
            (대연동)
            <br />
            정보 및 데이터베이스 시스템 연구실
            <br />
            Room #1309, A12, 45, Yongso-ro, Nam-gu, Busan, 48025, Republic of
            Korea
            <br />
            (Daeyeon Campus, Pukyong National University)
            <br />
            Fax: +82 51-627-6392
            <br />
            Email: <a href="mailto:njy3006@naver.com">njy3006@naver.com</a>
            <br />
            Team Name: TYPE-C
          </Address>
        </AddressSection>
        <MapContainer>
          <iframe
            title="Pukyong National University Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3262.889547188434!2d129.09819208891557!3d35.13442978961518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568ecfa6c70fef5%3A0x91d73fabede9cb01!2sWoongbi%20Gwan!5e0!3m2!1sen!2skr!4v1729660942495!5m2!1sen!2skr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </MapContainer>
      </Container>
    </>
  );
}

export default Contact;
