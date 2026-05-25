import vinylLogo from "../assets/recordLogo.svg";
import spotifyWhite from "../assets/Spotify_Full_Logo_RGB_White.png";
import { Button } from "./ui/button";

function Header({ isLoggedIn, logout }) {
  return (
    <>
      <div>
        {isLoggedIn ? (
          <div className="flex justify-end px-4 pt-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/25 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={logout}
            >
              Log out
            </Button>
          </div>
        ) : null}
        <div className="flex justify-center items-center space-x-2 mt-3 mr-[5px] sm:mr-0 mb-5 mx-auto">
          <img
            className="h-[45px] w-[45px] sm:h-[75px] sm:w-[75px]"
            src={vinylLogo}
          />
          <h1 className="text-[2.75rem] sm:text-[4.5rem] font-semibold text-center">
            Playlist Rewind
          </h1>
        </div>
        <p className="text-center font-semibold mx-auto mt-5 mb-5">
          connect with
        </p>
        <img className="h-[75px] mx-auto mt-5 mb-10" src={spotifyWhite} />
      </div>
    </>
  );
}

export default Header;
