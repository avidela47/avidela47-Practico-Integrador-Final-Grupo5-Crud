import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars, faBackward, faPlay, faPause, faForward } from '@fortawesome/free-solid-svg-icons';
import './style.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const audio = useRef(null);
  const navigate = useNavigate();

  const togglePlayPause = () => {
    if (audio.current.paused || audio.current.ended) {
      audio.current.play();
    } else {
      audio.current.pause();
    }
  };

  const handlePlayPauseClick = () => {
    togglePlayPause();
    const playPauseBtn = document.getElementById('play');
    playPauseBtn.querySelector('.pause-btn').classList.toggle('hide');
    playPauseBtn.querySelector('.play-btn').classList.toggle('hide');
  };

  const handleNavigate = () => {
    navigate('/start');
  };

  return (
    <div className="container-fluid2">
      <div className="player">        
        <div className="player__controls">
          <div className="player__btn player__btn--small" id="previous">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <h5 className="player__title">playing now</h5>
          <div className="player__btn player__btn--small" id="icon-menu">
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
        <div className="player__album">
          <img src="/Images/ab67616d00001e0292ada9778adbace61ee83fd2.jpg" alt="Album Cover" className="player__img" loading="amonamart" />
        </div>

        <h2 className="player__artist">Obscura</h2>
        <h3 className="player__song">The Anticosmic Overload</h3>

        <input type="range" defaultValue="20" min="0" className="player__level" id="range" />
        <div className="audio-duration">
          <div className="start">00:01</div>
          <div className="end">04:30</div>
        </div>

        <audio ref={audio} className="player__audio" controls id="audio" autoPlay loop>
          <source src="/Images/epicaSensorium.mp3" type="audio/mpeg" />
        </audio>

        <div className="player__controls">
          <div className="player__btn player__btn--medium" id="backward">
            <FontAwesomeIcon icon={faBackward} />
          </div>

          <div className="player__btn player__btn--medium blue play" id="play" onClick={handlePlayPauseClick}>
            <FontAwesomeIcon icon={faPlay} className="play-btn" />
            <FontAwesomeIcon icon={faPause} className="pause-btn hide" />
          </div>

          <div className="player__btn player__btn--medium" id="forward">
            <FontAwesomeIcon icon={faForward} />
          </div>
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm w-75" onClick={handleNavigate}>
          Ir al sitio...
        </button>      
      </div>
    </div>
  );
};

export default Home;
