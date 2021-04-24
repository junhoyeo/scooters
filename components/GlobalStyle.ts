import { createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
    word-break: keep-all;
  }

  button,
  input,
  textarea {
    border: 0;

    &:focus {
      outline: none;
    }
  }

  body {
    margin: 0;
    font-family: -apple-system, system-ui, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  img {
    user-select: none;
    -webkit-user-drag: none;
  }
`;
