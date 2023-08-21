import ModuleCard from "../../components/modulecard/ModuleCard";

import "./Home.scss";

import linkmanagerCoverImg from "../../assets/modules/linkmanager/coverImg.png";

function LinkManagerCard() {
  const title = "Link-Manager";
  const description = "Bulk download media via a list of links.";
  const moduleLink = "/linkmanager";

  return (
    <ModuleCard
      title={title}
      description={description}
      coverImg={linkmanagerCoverImg}
      moduleLink={moduleLink}
    />
  );
}

function Home() {
  return (
    <div className="module-container">
      <LinkManagerCard />
    </div>
  );
}

export default Home;
