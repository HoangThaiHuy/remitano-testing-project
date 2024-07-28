import React from 'react' 
 import MovieList from "@/components/MovieList";

 const initialFilters = { keyword: '', page: null }


function Home() {
  const [filters, setFilters] = React.useState({ ...initialFilters })

  return (
   <div className="home-page mt-20"> 
      <div className="container page">
        <div className="row">
          <div className="offset-md-2 col-md-9"> 
           <MovieList filters={filters}/>
          </div> 
        </div>
      </div>
    </div>
  )
}

export default Home
