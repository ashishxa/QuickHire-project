export default function AdminDashboard(){
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
          <h1 className="text-white font-weight-bold">Dashboard</h1>
          <div className="custom-breadcrumbs">
            <a href="index.html">Home</a> <span className="mx-2 slash">/</span>
            <span className="text-white">
              <strong>Dashboard</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
        </>
    )
}