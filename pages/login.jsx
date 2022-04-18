import React from "react";
import {getProviders, signIn} from "next-auth/react"

const Loginlogin = ({providers}) => {
  return (
    <div className="flex items-center justify-center bg-black h-screen flex-col">
      <img className="w-54 mb-5" 
           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDMSRReQR8OAuwCddR2viWKFKAATuHuEPydvHHzfLx9-QRjFy2PNfypuorxF4tCmzPifc&usqp=CAU"
           alt="Spotify logo image"
           />
      
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.id}>
            <button
                    className="bg-[#18D860] text-white p-5 rounded-full"
                    onClick={() => signIn(provider.id, {callbackUrl: "/"})}
            >
              LOGIN with {provider.name}
            </button>
          </div>
        )
      })}
    </div>
  )
};

export default Loginlogin;


export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers
    }
  }
}