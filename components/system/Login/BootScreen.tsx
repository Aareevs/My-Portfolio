import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingScreenProps {
  onComplete: () => void;
}

const orbit = keyframes`
  0% { transform: rotate(225deg); opacity: 1; animation-timing-function: ease-out; }
  7% { transform: rotate(345deg); animation-timing-function: linear; }
  30% { transform: rotate(455deg); animation-timing-function: ease-in-out; }
  39% { transform: rotate(690deg); animation-timing-function: linear; }
  70% { transform: rotate(815deg); opacity: 1; animation-timing-function: ease-out; }
  75% { transform: rotate(945deg); opacity: 0; animation-timing-function: ease-out; }
  76% { transform: rotate(945deg); opacity: 0; }
  100% { transform: rotate(945deg); opacity: 0; }
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 44px;
  height: 44px;

  .circle {
    position: absolute;
    width: 44px;
    height: 44px;
    opacity: 0;
    transform: rotate(225deg);
    animation: ${orbit} 5.5s infinite;

    &::after {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #fff;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
    }
  }

  .circle:nth-child(2) { animation-delay: 240ms; }
  .circle:nth-child(3) { animation-delay: 480ms; }
  .circle:nth-child(4) { animation-delay: 720ms; }
  .circle:nth-child(5) { animation-delay: 960ms; }
`;

const BootScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  user-select: none;
  overflow: hidden;
`;

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // Simulate boot time
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // 3.5 seconds boot time

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <BootScreenContainer>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '42rem', paddingBottom: '5rem', marginTop: '-10vh' }}>
        
        {/* Windows 10 Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6rem' }}>
          <svg viewBox="0 0 88 88" style={{ width: '104px', height: '104px', color: '#0078D7', fill: 'currentColor' }}>
            <path d="M0 12.4l35.6-4.8v34.4H0V12.4zm0 33.6h35.6v34.4L0 75.6V46zM40 6.6L88 0v41H40V6.6zm0 38.4H88v41L40 79.4V45z"/>
          </svg>
        </div>

        {/* Windows 10 Spinner */}
        <div style={{ marginTop: '4rem' }}>
          <SpinnerContainer>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </SpinnerContainer>
        </div>

      </div>
    </BootScreenContainer>
  );
};

export default LoadingScreen;
