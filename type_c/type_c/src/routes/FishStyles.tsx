// FishStyles.tsx
import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.black.veryDark};
  text-align: center;
  margin: 100px 0;
`;

export const Loader = styled.span`
  text-align: center;
  display: block;
`;

export const ErrorMessage = styled.span`
  color: red;
  text-align: center;
  display: block;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 15px;
`;

export const Button = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) =>
    props.disabled
      ? "#ccc" // ��Ȱ��ȭ�� ��ư�� ����
      : props.active
      ? props.theme.accentColor
      : "#444"};
  color: ${(props) =>
    props.disabled ? "#666" : "white"}; // ��Ȱ��ȭ�� ��ư�� ���ڻ�
  border: none;
  border-radius: 8px;
  cursor: ${(props) =>
    props.disabled ? "not-allowed" : "pointer"}; // Ŀ�� ��� ����
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#ccc" : props.theme.accentColor};
  }
`;
