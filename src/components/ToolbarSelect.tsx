import styled from "styled-components";

type Props = { active?: boolean; };

export default styled.select<Props>`
  display: inline-block;
  flex: 0;

  ${props => props.active && "opacity: 1;"};
`;
