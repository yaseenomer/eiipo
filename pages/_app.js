import Link from "next/link";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
            <Link href="/">
              <a className="nav-link active" aria-current="page" >
               
                Home
              </a>
              </Link>

              <Link href="/create-item">
              <a className="nav-link" href="#">
                Create Item
              </a>
              </Link>
              
            </div>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
