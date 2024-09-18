import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    btnColor: string;
    accentColor: string;
    accentColor2: string;
    cardBgColor: string;
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };
  }
}
