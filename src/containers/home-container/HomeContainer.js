import React from "react";
import ReactModal from "react-modal";

import HomePage from "../../pageComponents/HomePage";
import CardImage from "../../components/cardImage";

import { MOVIE_BASE_URL } from "../../utils/constants";

export default class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      movies: [],
      movie: null,
      showMovieDetailsModal: false,
    };
  }

  async componentDidMount() {
    try {
      const movieTrendingUrl = `${MOVIE_BASE_URL}/trending/movie/day?page=1`;
      const responsePromise = await fetch(movieTrendingUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const response = await responsePromise.json();

      this.setState({
        isLoaded: true,
        movies: response.results,
      });
    } catch (e) {
      this.setState({
        error: e,
        isLoaded: true,
      });
    }
  }

  handleOpenMovieModal = (movieId) => {
    this.setState({showMovieDetailsModal: true });
    this.fetchMovie(movieId);
    
  };

  handleCloseMovieModal = () => {
    this.setState({ showMovieDetailsModal: false });
  };

  fetchMovie = async (movieId) => {
    try {
      const movieUrl = `${MOVIE_BASE_URL}/movie/${movieId}`;
      const responsePromise = await fetch(movieUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const response = await responsePromise.json();

      this.setState({
        movie: response
      });
    } catch (e) {
      console.log('there was an error');
    }
  }

  render() {
    const { error, isLoaded, movies, movie } = this.state;
    const hasMovies = movies && movies.length > 0;
    return (
      <>
        {error && <div>Error: {error.message}</div>}
        {!isLoaded && <div>Loading...</div>}
        {isLoaded && !error && hasMovies && (
          <>
            <HomePage movies={movies} onCardClick={this.handleOpenMovieModal} />
            {movie ? (
              <ReactModal
              isOpen={this.state.showMovieDetailsModal}
              // gets called for closing the modal via esc / other keys
              onRequestClose={this.handleCloseMovieModal}
              >
              {/* release date, length, description, genre, title, rating, IMDb link */}
              <button onClick={this.handleCloseMovieModal}>X</button>
              <div className="image-div" style={{height: '100px'}, {width: '100px'}}>
                <CardImage path={movie.poster_path} title={movie.title}/>
              </div>
              <div className="text">
                <h2>{movie.title}</h2>
                <p>Release Date: {movie.release_date}</p>
                <p>Runtime: {movie.runtime} minutes </p>
                <p><strong>Description: </strong>{movie.overview}</p>
                {console.log(movie)}
                {/* <p>Genres: {Object.values(movie.genres)}</p> */}
                {/* <ul>
                  {
                    movie.genres.map((genre) => {
                    return <li>{genre.name}</li>
                    })
                  }
                </ul> */}
                
              </div>
            </ReactModal>
            ) : null }
            
          </>
        )}
      </>
    );
  }
}
