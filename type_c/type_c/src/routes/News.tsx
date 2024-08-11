import { useParams, Link } from "react-router-dom";
import styled from "styled-components"

const Title = styled.h1`
    color:${props =>props.theme.accentColor};
`;

interface NewsParams{
    newsDate: string;
}

function News(){
    const {newsDate} = useParams<NewsParams>();
    console.log(newsDate);
    return <Title>
        NewsDate: {newsDate}
    </Title>

}
export default News;