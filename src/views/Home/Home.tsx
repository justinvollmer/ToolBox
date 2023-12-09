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
      released={false}
      mainDeveloper="Justin Vollmer"
      mainDeveloperBadge={<LeadDeveloper />}
    />
  );
}

function GalleryCard() {
  const title = "Gallery";
  const description = "WORK IN PROGRESS! Name may not be final!";
  const moduleLink = "/gallery";
  const info = "WORK IN PROGRESS! Name may not be final!";

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
      <GalleryCard />
    </div>
  );
}

export default Home;
