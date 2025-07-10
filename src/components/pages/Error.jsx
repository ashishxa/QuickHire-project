import { Link } from "react-router-dom"
export default function Error(){
    return(
        <>
    <div className="textcenter ">
        <h1>404</h1>
        <h1>Page not found!!</h1>
        <Link to="/">Back to home</Link>
    </div>
        </>
    )
}