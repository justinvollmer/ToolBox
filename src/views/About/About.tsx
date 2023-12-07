import { Avatar } from "@mui/material/";
import { LeadDeveloper } from "../../components/badges/BadgeCollection";

import "./About.scss";

function About() {
  return (
    <div className="profile-container unselectable">
      <Avatar
        src="/src/assets/avatar.png"
        alt="Profile Picture"
        className="avatar"
      />
      <h1>
        Justin Vollmer <LeadDeveloper />
      </h1>
      <p className="role">Lead Developer</p>
      <div className="about">
        <h2>About Me</h2>
        <p>
          Welcome to my profile! I am a passionate developer with a love for
          coding and creating awesome things. Visit me on{" "}
          <a href="https://github.com/justinvollmer" target="_blank">
            GitHub
          </a>{" "}
          and follow this project{" "}
          <a href="https://github.com/justinvollmer/ToolBox" target="_blank">
            here
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default About;
