import React,{useState} from "react";
import Nav from "../NavBar/Nav";
import Register from "../Login/Register";

const ManageUser = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex">
            <Nav collapsed={collapsed} setCollapsed={setCollapsed} />
            <Register collapsed={collapsed} />
        </div>
    );
};
  
export default ManageUser;