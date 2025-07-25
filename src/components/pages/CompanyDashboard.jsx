export default function CompanyDashboard(){
    return(
        <>
         <section
    className="section-hero overlay inner-page bg-image"
    style={{ backgroundImage: 'url(/assets/images/hero_1.jpg)' }}
    id="home-section"
  >
    <div className="container">
      <div className="row">
        <div className="col-md-7">
          <h1 className="text-white font-weight-bold">Company</h1>
          <div className="custom-breadcrumbs">
            <a href="#">Home</a> <span className="mx-2 slash">/</span>
            <span className="text-white">
              <strong>Company</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
    <div className="container">
      <div className="row mb-5 justify-content-center">
        <div className="col-md-7 text-center">
          <h2 className="section-title mb-2 text-white">JobBoard Site Stats</h2>
          <p className="lead text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
            unde officiis recusandae sequi excepturi corrupti.
          </p>
        </div>
      </div>
      <div className="row pb-0 block__19738 section-counter">
        <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <strong className="number" data-number={1930}>
              0
            </strong>
          </div>
          <span className="caption">Candidates</span>
        </div>
        <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <strong className="number" data-number={54}>
              0
            </strong>
          </div>
          <span className="caption">Jobs Posted</span>
        </div>
        <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <strong className="number" data-number={120}>
              0
            </strong>
          </div>
          <span className="caption">Jobs Filled</span>
        </div>
        <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <strong className="number" data-number={550}>
              0
            </strong>
          </div>
          <span className="caption">Companies</span>
        </div>
      </div>
    </div>
        </>
    )
}