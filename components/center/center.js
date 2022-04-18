import {useEffect, useState} from "react";
import {useSession, signOut} from "next-auth/react"
import { ChevronDownIcon } from "@heroicons/react/outline";
import {shuffle} from "lodash";
import {useRecoilValue, useRecoilState} from "recoil";
//const 
import {playlistIdState, playlistState} from "../../atoms/playlistAtom";
import useSpotify from "../../hooks/useSpotify";
import Songs from "../songs/songs";


const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const Center = (props) => {
  const {data: session} = useSession();
  const [color, setColor] = useState(null);
  const spotifyApi = useSpotify();
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);


  useEffect(() =>{
    setColor(shuffle(colors).pop())
  }, [playlistId])


  useEffect(() =>{

    if(spotifyApi.getAccessToken()) {
      spotifyApi.getPlaylist(playlistId).then((data) => {
        setPlaylist(data.body);
      }).catch((error) => console.log("Something went wrong!", error));
    }
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow relative h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <button className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
                onClick={signOut}
        >
          <img src={session?.user.image} 
               className="w-10 h-10 rounded-full mr-2"
               alt="user image" />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </button>
      </header>
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
      <img src={playlist?.images?.[0]?.url} 
           className="w-44 h-44 shadow-2xl"
           width={playlist?.images?.[0]?.width}
           height={playlist?.images?.[0]?.height}
      />
      <div>
        <p>PLAYLIST</p>
        <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
        <div>
          <p className="text-sm">
            <span>Owner</span>
            <a href={playlist?.owner.external_urls.spotify} className="underline ml-1" target="_blank">
            {playlist?.owner.display_name}
            </a>

          </p>
        </div>
      </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
};


export default Center;
