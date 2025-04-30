import React,{useState} from "react";
import Dashboard from "../Dashborad/Dashboard";
import Nav from "../NavBar/Nav";

const MainDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex">
            <Nav collapsed={collapsed} setCollapsed={setCollapsed} />
            <Dashboard collapsed={collapsed} />
        </div>
    );
};
  
export default MainDashboard;