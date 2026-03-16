import styled from "styled-components";

type StyledTaskbarEntriesProps = {
  $clockWidth: number;
  $hasAI: boolean;
  $trayWidth: number;
};

const StyledTaskbarEntries = styled.ol<StyledTaskbarEntriesProps>`
  column-gap: 1px;
  display: flex;
  height: 100%;
  left: ${({ theme }) => theme.sizes.taskbar.button.width * 2}px;
  margin: 0 3px;
  overflow: hidden;
  position: absolute;
  right: ${({ $clockWidth, $hasAI, $trayWidth, theme }) =>
    `calc(${$trayWidth}px + ${$clockWidth}px + ${$hasAI ? theme.sizes.taskbar.ai.buttonWidth : "0px"})`};
`;

export default StyledTaskbarEntries;
