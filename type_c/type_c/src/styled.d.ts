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
    blue: {
      dodger: string;
      darker: string;
    };
    borderColor: string; // Light Gray
    headerBgColor: string; // Very Light Gray
    headerTextColor: string; // Dark Gray
    rowEvenBgColor: string; // Off-White for even rows
    rowHoverBgColor: string; // Slightly darker for hover
    linkColor: string; // DodgerBlue
    linkHoverColor: string; // Darker Blue
    disabledBgColor: string; // Gray
    disabledTextColor: string; // Light Gray
  }
}
