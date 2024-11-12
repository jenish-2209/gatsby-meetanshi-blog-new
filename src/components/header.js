import * as React from "react";
import { Link } from "gatsby";

const Header = () => {
  return (
    <header className="site-header site-header-custom">
      <nav className="navbar navbar-custom">
        <div className="container">
          <div className="row" style={{ width: "100%", display:"flex"}}>
            <div className="col-md-6">
              <Link to="/">
                {/* Use the static logo image URL here */}
                <img
                  src="/images/logo.svg"// Replace with the actual path to your static logo
                  alt="Site Logo"
                  style={{ width: "250px", height: "auto", marginBottom: "0" }}
                />
              </Link>
            </div>
            <div className="col-md-6" style={{textAlign: 'right'}}>
              <form action="/search" method="GET">
                <input
                  type="text"
                  name="query"
                  placeholder="Search for posts..."
                  required
                />
                <button type="submit">Search</button>
              </form>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;