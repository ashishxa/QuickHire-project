import { Outlet } from "react-router-dom";
import CompanyFooter from "./CompanyFooter";
import CompanyHeader from "./CompanyHeader";

export default function CompanyLayout(){
    return(
        <>
        <CompanyHeader/>
        <Outlet/>
        <CompanyFooter/>

        </>
    )
}