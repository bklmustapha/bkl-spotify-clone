import {useState, useEffect} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "./useSpotify"
import {currentTrackIdState} from "../atoms/songAtom";

 
const useSongInfo = (props) => {
  const spotifyApi = useSpotify();
  const currentIdTrack = useRecoilValue(currentTrackIdState);
  const [songInfo, setSongInfo] = useState();

  useEffect(() =>{
    const fetchSongInfo = async () => {
      if(currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            }
          }
        ).then(res => res.json());
        setSongInfo(trackInfo);
      }
    }

    fetchSongInfo();
  }, [currentIdTrack, spotifyApi])



  return songInfo;
};



export default useSongInfo;
