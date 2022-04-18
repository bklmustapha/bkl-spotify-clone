import {useRecoilValue} from "recoil";
import {playlistState} from "../../atoms/playlistAtom";
import Song from "./song";

const Songs = (props) => {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      {playlist?.tracks?.items.map((song, index) => {
        return (
          <Song key={song?.track?.id} track={song} order={index} />
        )
      })}
    </div>
  )
};


export default Songs;
