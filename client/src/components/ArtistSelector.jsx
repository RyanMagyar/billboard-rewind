/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { Input } from "./ui/input";
function ArtistSelector({ artist, setArtist, getArtistData }) {
  return (
    <>
      <div>
        <div className="mx-auto font-semibold text-center mb-4">
          <p>Type an artist&apos;s name to see their chart history!</p>
        </div>
        <div className="flex flex-col items-center mx-auto md:w-[500px] w-full space-y-4">
          <Input
            type="text"
            value={artist}
            placeholder="Artist"
            onChange={(e) => setArtist(e.target.value)}
            className={"w-[300px]"}
          />
          <Button disabled={artist ? false : true} onClick={getArtistData}>
            Get Artist Data
          </Button>
        </div>
      </div>
    </>
  );
}

export default ArtistSelector;
