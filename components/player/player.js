import { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import {useSession} from "next-auth/react";
import {debounce} from "lodash";
import {currentTrackIdState, isPlayingState} from "../../atoms/songAtom";
import useSpotify from "../../hooks/useSpotify"
import useSongInfo from "../../hooks/useSongInfo"
import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/solid";

const Player = () => {
  const spotifyApi = useSpotify();
  const {data: session, status} = useSession();
  const [currentIdTrack, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlayin] = useRecoilState(isPlayingState)
  const [volume, setvolume] = useState(50);
  const songInfo = useSongInfo();


  const fetchCurrentInfo = () => {
    if(!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentIdTrack(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlayin(data.body?.is_playing);
        })
      })
    }
  }


  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if(data.body?.is_playing) {
        spotifyApi.pause().catch((error) => console.log("PREMIUM REQUIRED",error));
        setIsPlayin(false);
      }
      else {
        spotifyApi.play().catch((error) => console.log("PREMIUM REQUIRED",error));
        setIsPlayin(true);
      }
    });
  }

  useEffect(() => {
    if(spotifyApi.getAccessToken() && !currentIdTrack) {
      // Fetch the song info
      fetchCurrentInfo();
      setvolume(50);    
    }
  }, [currentTrackIdState,spotifyApi, session])


  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => console.log('PREMIUM REQUIRED', error)); // REQUIRED PREMIUM ACCOUNT
    }, 100), [])

  useEffect(() =>{
    if(volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume])
 
  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Song INfo */}
      <div className="flex items-center space-x-4">
        <img src={songInfo?.album?.images?.[0].url}
             className="hidden md:inline h-10 w-10"
             alt="" />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>

      {/* Player control */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ): (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      {/* Volume control */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeOffIcon className="button"
                       onClick={() => volume > 0 && setvolume(volume - 10)}
        />
        <input type="range"
               value={volume} 
               className="w-14 md:w-28 transition-all ease-out duration-500"
               min={0}
               max={100}
               onChange={(e) => setvolume(Number(e.target.value))} />
        <VolumeUpIcon className="button"
                      onClick={() => volume < 100 && setvolume(volume + 10)}
        />
      </div>
    </div>
  )
};

export default Player;
