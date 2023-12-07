import Badge from "./Badge";
import {
  Verified as VerifiedIcon,
  VerifiedUser as CertifiedIcon,
} from "@mui/icons-material";

function LeadDeveloper() {
  const title: string = "Lead Developer";

  const description: string =
    "This contributor is verified to be the Lead Developer of ToolBox.";

  return (
    <Badge
      title={title}
      description={description}
      icon={<VerifiedIcon />}
      iconColor="#1DA1F2"
      learnMoreLink="/About"
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

export { LeadDeveloper, CertifiedModule };
