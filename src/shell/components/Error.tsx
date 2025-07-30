import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { shellLogger } from '../logger';
import { OneFEErrorComponentProps } from '@1fe/shell';

const PageContainer = styled.div({
  fontFamily: 'DSIndigo',
  margin: '4vh auto',
  width: '100%',
  maxWidth: '80vw',
  height: 'auto',
  display: 'flex',
  justifyContent: 'center',
});

const AnimationContainer = styled.div({
  height: '200px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '@media only screen and (max-width: 480px)': {
    line: {
      display: 'none',
    },
  },
});

const MainText = styled.h1({
  margin: 0,
});

const SubText = styled.p({
  fontSize: '1rem',
  lineHeight: 1.5,
  marginTop: '8px',
});

type ErrorPageType = 'error' | 'notFound';

type ErrorPageData = {
  [key in ErrorPageType]: {
    titleText: string;
    subText: string;
    buttonText: string;
  };
};

type ErrorProps = {
  type?: ErrorPageType;
  plugin?: OneFEErrorComponentProps['plugin'];
  message?: string | undefined;
};

// The SideLine is a SVG that helps keep the animation at the proper aspect ratio while still being responsive on larger screens. It looks like a continuation of the animation and is on both the left and right side of the animation
const SideLine = () => {
  return (
    <svg
      width='100%'
      height='200'
      viewBox='0 0 1500 200'
      preserveAspectRatio='none'
      aria-hidden='true'
    />
  );
};

export const Error = ({ type = 'error', plugin, message }: ErrorProps = {}) => {
  useEffect(() => {
    shellLogger.log({
      message: '[1FE-Shell] error page rendered',
      errorComponent: {
        type,
        plugin,
        message,
      },
    });

    // We should flush this log right away, users will often navigate away after an error page and the request *might* get canceled
    // KazMon sdk flushes on beforeUnload events but this is not 100% reliable in all browsers and scenarios.
    // logger.flush();
  }, []);

  const ErrorPageData: ErrorPageData = {
    error: {
      titleText: 'An error has occurred',
      subText: 'Make sure your connection is stable and try again',
      buttonText: 'Try Again',
    },
    notFound: {
      titleText: 'Looks like this page is not here',
      subText: 'Check your URL, or go back',
      buttonText: 'Go Back',
    },
  };

  const mainText = message ?? ErrorPageData[type].titleText;
  const subText = ErrorPageData[type].subText;

  return (
    <>
      <AnimationContainer>
        <SideLine />
      </AnimationContainer>

      <PageContainer>
        <div>
          <MainText data-qa={`shell.${type}.page.header`}>{mainText}</MainText>

          <SubText>{subText}</SubText>
        </div>
      </PageContainer>
    </>
  );
};
