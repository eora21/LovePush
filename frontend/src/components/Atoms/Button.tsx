/**
 * @author Hyeonsooryu
 */

import { ReactNode } from 'react';
import styled from 'styled-components';

interface ButtonStyleProps {
  inline: boolean;
  width: string;
  height: string;
  textColor: string;
  bgColor: string;
  shadow: boolean;
  margin: string;
  fontSize: string;
}

interface ButtonProps extends ButtonStyleProps {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({
  inline,
  width,
  height,
  textColor,
  bgColor,
  shadow,
  margin,
  fontSize,
  icon,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <StyledButton
      inline={inline}
      width={width}
      height={height}
      textColor={textColor}
      bgColor={bgColor}
      shadow={shadow}
      margin={margin}
      fontSize={fontSize}
      onClick={onClick}
    >
      <Container>
        {icon}
        {children}
      </Container>
    </StyledButton>
  );
};

Button.defaultProps = {
  inline: false,
  width: '100%',
  height: '32px',
  textColor: 'white',
  bgColor: '#4095FF',
  shadow: false,
  margin: '0',
  fontSize: '14px',
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const StyledButton = styled.button<ButtonStyleProps>`
  display: ${(props) => (props.inline ? 'inline-block' : 'block')};
  color: ${(props) => props.textColor};
  background-color: ${(props) => props.bgColor};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 16px;
  border: none;
  padding: 6px;
  font-size: ${(props) => props.fontSize};
  cursor: pointer;
  filter: ${(props) =>
    props.shadow ? 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.2))' : ''};
  margin: ${(props) => props.margin};
`;

export default Button;
