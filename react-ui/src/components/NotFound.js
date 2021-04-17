import { withRouter } from "react-router"

function NotFound(props) {
    return(
        <div className="flex-container">
            <h1>404 - Page Not Found</h1>
            <hr />
            <p>The page you are looking for does not exist or an unknown error occured. Click <a href="/">here</a> to go back to the home page.</p>
        </div>
    )
};

export default withRouter(NotFound);