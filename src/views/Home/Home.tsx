import ModuleCard from "../../components/modulecards/ModuleCard";

import { LeadDeveloper } from "../../components/badges/BadgeCollection";

import "./Home.scss";

function LinkManagerCard() {
  const title = "Link-Manager";
  const description = "Bulk download media via a list of links.";
  const moduleLink = "/linkmanager";
  const info =
    "It allows you to write, load, and save a list of links. You can open them all in your selected browser or simply download images, videos and gifs with one click. It will also allow you to encrypt your list of links with a 256-bit AES encryption.";

  return (
    <ModuleCard
      title={title}
      description={description}
      moduleLink={moduleLink}
      info={info}
      released={true}
      mainDeveloper="Justin Vollmer"
      mainDeveloperBadge={<LeadDeveloper />}
    />
  );
}

function RandomizerCard() {
  const title = "Randomizer";
  const description =
    "Pick a random item from a multi layer JSON object array.";
  const moduleLink = "/randomizer";
  const info =
    "Pick a random item from a multi layer JSON object. The JSON has an array with objects which each has a string title and content array. The randomizer will pick the a random item and then will one layer deeper to pick a random content item.";

  return (
    <ModuleCard
      title={title}
      description={description}
      moduleLink={moduleLink}
      info={info}
      released={false}
      mainDeveloper="Justin Vollmer"
      mainDeveloperBadge={<LeadDeveloper />}
    />
  );
}

function Home() {
  return (
    <div className="main-container">
      <LinkManagerCard />
      <RandomizerCard />
    </div>
  );
}

export default Home;
