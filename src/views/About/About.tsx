import { Creator } from "../../components/badges/BadgeCollection";

import "./About.scss";

function About() {
  return (
    <div>
      <p className="unselectable">App by Justin Vollmer {Creator()}</p>
    </div>
  );
}

export default About;
