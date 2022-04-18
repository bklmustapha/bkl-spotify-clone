import {useState, useEffect} from "react";
import {signOut, useSession} from "next-auth/react";
import {HomeIcon, SearchIcon, LibraryIcon, RssIcon, PlusCircleIcon} from "@heroicons/react/outline"
import {HeartIcon} from "@heroicons/react/solid"
import {useRecoilState} from "recoil";
import {playlistIdState} from "../../atoms/playlistAtom";
import useSpotify from "../../hooks/useSpotify";



const Sidebar = () => {

  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const spotifyApi = useSpotify();
  const {data: session, status} = useSession();

  useEffect(() =>{
    if(spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      })
    }
  }, [session, spotifyApi]);


  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
      <div className="space-y-4">
        <button className="flex space-x-2 items-center hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </button>
        <button className="flex space-x-2 items-center hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <span>Search</span>
        </button>
        <button className="flex space-x-2 items-center hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <span>Your Library</span>
        </button>
        <hr className="bordr-t-[0.1px] border-gray-900" />

        <button className="flex space-x-2 items-center hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <span>Create Playlist</span>
        </button>
        <button className="flex space-x-2 items-center hover:text-white">
          <HeartIcon className="h-5 w-5 text-blue-500" />
          <span>Liked Songs</span>
        </button>
        <button className="flex space-x-2 items-center hover:text-white">
          <RssIcon className="h-5 w-5 text-green-500" />
          <span>your Ipisodes</span>
        </button>
        <hr className="bordr-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => {
          return (
            <p key={playlist.id} 
               className="cursor-pointer hover:text-white"
               onClick={() => setPlaylistId(playlist.id)}
               >
              {playlist.name}
            </p>
          )
        })}
    
      </div>
    </div>
  )
};

export default Sidebar;
