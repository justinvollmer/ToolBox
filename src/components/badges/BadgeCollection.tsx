import Badge from "./Badge";
import { TerminalRounded } from "@mui/icons-material";

function LeadDeveloper() {
  const title: string = "Lead Developer";

  const description: string =
    "This contributor has been verified to be the Lead Developer of ToolBox.";

  return (
    <Badge
      title={title}
      description={description}
      icon={<TerminalRounded />}
      iconColor="#1DA1F2"
      learnMoreLink="/about"
    />
  );
}

function WorkInProgress() {
  const title: string = "Work In Progress";

  const description: string =
    "This Module is still work in progress. Please stay tuned for upcoming updates!";

  const svg: JSX.Element = (
    <svg
      fill="#ed4e0a"
      width="32px"
      height="32px"
      viewBox="0 0 36 36"
      version="1.1"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>beta-line</title>
      <path d="M7.21,14.07h3a1.61,1.61,0,0,1,1.81,1.5,1.44,1.44,0,0,1-.84,1.34,1.67,1.67,0,0,1,1.1,1.53,1.75,1.75,0,0,1-2,1.63H7.21Zm2.71,2.42c.48,0,.82-.28.82-.67s-.34-.65-.82-.65H8.49v1.32Zm.2,2.48a.75.75,0,1,0,0-1.47H8.49V19Z"></path>
      <path d="M14.55,15.23v1.2h3v1.16h-3v1.32h3.33v1.16H13.26v-6h4.62v1.16Z"></path>
      <path d="M20.41,15.23H18.54V14.07h5v1.16H21.7v4.84H20.41Z"></path>
      <path d="M28,19.12H25.32l-.38.95H23.5l2.44-6h1.44l2.45,6H28.38ZM27.55,18l-.89-2.19L25.77,18Z"></path>
      <path d="M8.06,30a.84.84,0,0,1-.38-.08A1,1,0,0,1,7.06,29V25h-4a1,1,0,0,1-1-1V10a1,1,0,0,1,1-1h30a1,1,0,0,1,1,1V24a1,1,0,0,1-1,1H13.48L8.77,29.71A1,1,0,0,1,8.06,30Zm-4-7h4a1,1,0,0,1,1,1v2.59l3.3-3.3a1,1,0,0,1,.7-.29h19V11h-28Z"></path>
      <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
    </svg>
  );

  return <Badge title={title} description={description} icon={svg} />;
}

export { LeadDeveloper, WorkInProgress };
