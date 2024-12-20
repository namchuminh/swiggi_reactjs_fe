import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section
      className="content"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="error-page">
        <h2 className="headline text-warning"> 404</h2>

        <div className="error-content">
          <h3>
            <i className="fas fa-exclamation-triangle text-warning"></i> Oops!
            Page not found.
          </h3>

          <p>
            We could not find the page you were looking for. Meanwhile, you may
            <Link to="/"> return to dashboard </Link> 
            or try using the search form.
          </p>

          <form className="search-form">
            <div className="input-group">
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Tìm kiếm"
              />

              <div className="input-group-append">
                <button type="submit" name="submit" className="btn btn-warning">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
