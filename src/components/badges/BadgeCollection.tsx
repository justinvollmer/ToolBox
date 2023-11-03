import Badge from "./Badge";
import {
  Verified as VerifiedIcon,
  VerifiedUser as CertifiedIcon,
} from "@mui/icons-material";

function AppCreator() {
  const title: string = "App Creator";

  const description: string =
    "This contributor is verified to be the main creator of ToolBox.";

  return (
    <Badge
      title={title}
      description={description}
      icon={<VerifiedIcon />}
      iconColor="#1DA1F2"
      learnMoreLink="https://github.com/justinvollmer"
    />
  );
}

function CertifiedModule() {
  const title: string = "Certified Module";

  const description: string =
    "This module has officially been made by the App Creator.";

  return (
    <Badge
      title={title}
      description={description}
      icon={<CertifiedIcon />}
      iconColor="#808080"
    />
  );
}

export { AppCreator, CertifiedModule };
