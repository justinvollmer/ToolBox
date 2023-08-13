import { Outlet } from "react-router-dom";
import Navbar from "../views/Navbar/Navbar";

function BaseLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default BaseLayout;
