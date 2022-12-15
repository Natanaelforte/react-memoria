import styled from "styled-components";

type ContainerProps={
    showBackground: boolean;
}
export const Container = styled.div<ContainerProps>`
    background-color: ${props => props.showBackground ? '#1550ff' : '#e2e3e3'};
    heigth: 100px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    @media (max-width: 750px) {
        border-radius: 10px;
        
        
    }
`;

type IconProps = {
    opacity?: number;
}
export const Icon = styled.img<IconProps>`
    heigth: 40px;
    width: 40px;
    opacity: ${props => props.opacity ?? 1};

    @media (max-width: 750px) {
        padding: 8px;
    }
`;