import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //A snippet of code which runs on a specific condition/variable
  useEffect(() => {
    //everytime the row loads this will fetch info
    //if [] - run once when the row loads and dont run again
    //if [variable]- run once when the row load + run every time variable changes

    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // console.log(request, "req");
      setMovies(request.data.results);
      return request;
      //request.data.result
    }
    fetchData(fetchUrl); //any var we are pulling inside useEffect should be included inside [] as rendering depends on this var
  }, [fetchUrl]);
  console.log(movies); //console.table

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(
        movie?.name ||
          movie?.original_title ||
          movie?.title ||
          movie?.original_name ||
          ""
      )
        .then((url) => {
          console.log(movie.original_name, "movieName");
          console.log(url, "url");
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="row">
      {/* title */}
      <h2>{title}</h2>
      <div className="row_posters">
        {/* several row posters */}
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;

//rfce - code snippet (FC)
