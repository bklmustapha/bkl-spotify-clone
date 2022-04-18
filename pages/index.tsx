import {getSession} from "next-auth/react";
import Sidebar from "../components/sidebar/sidebar";
import Center from "../components/center/center";
import Player from "../components/player/player"

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* center */}
        <Center />
      </main>


      <div className="sticky bottom-0">
        {/* Player */}
        <Player />
      </div>
    </div>
  )
}

export default Home



export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    }
  }
}
