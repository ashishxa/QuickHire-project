import { Outlet } from "react-router-dom";
import CompanyFooter from "./CompanyFooter";
import CompanyHeader from "./CompanyHeader";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyLayout(){
      let isLogin=sessionStorage.getItem("isLogin")
        let userType=sessionStorage.getItem("userType")
        let nav=useNavigate()
        useEffect(()=>{
            if(!isLogin || userType!=2){
                toast.error("Please login")
                nav("/login")
            }
        },[])
    return(
        <>
        <CompanyHeader/>
        <Outlet/>
        <CompanyFooter/>

        </>
    )
}