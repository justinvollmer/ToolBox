import ModuleCard from "../../components/modulecards/ModuleCard";

import { AppCreator } from "../../components/badges/BadgeCollection";

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
      certified={true}
      mainDeveloper="Justin Vollmer"
      mainDeveloperBadge={<AppCreator />}
    />
  );
}

function WatchlistCard() {
  const title = "Movie/TV Watchlist";
  const description =
    "Create a list to plan out what you are going to watch next.";
  const moduleLink = "/watchlist";
  const info = "Create a list to plan out what you are going to watch next.";

  return (
    <ModuleCard
      title={title}
      description={description}
      moduleLink={moduleLink}
      info={info}
      certified={true}
      mainDeveloper="Justin Vollmer"
      mainDeveloperBadge={<AppCreator />}
    />
  );
}

function EventCalendarCard() {
  const title = "Event Calendar";
  const description =
    "An easy way to manage your time schedule and getting an overview for upcoming events.";
  const moduleLink = "/events";
  const info =
    "An easy way to manage your time schedule and getting an overview for upcoming events.";

  return (
    <ModuleCard
      title={title}
      description={description}
      moduleLink={moduleLink}
      info={info}
      certified={true}
      mainDeveloper="Justin Vollmer"
      mainDeveloperBadge={<AppCreator />}
    />
  );
}

function Home() {
  return (
    <div className="main-container">
      <LinkManagerCard />
      <WatchlistCard />
      <EventCalendarCard />
    </div>
  );
}

export default Home;
