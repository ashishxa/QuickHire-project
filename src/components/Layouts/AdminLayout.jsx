import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";
import AdminFooter from "./AdminFooter";


export default function AdminLayout(){
    return(
        <>
        <AdminHeader/>
        <Outlet/>
        <AdminFooter/>
        </>
    )
}