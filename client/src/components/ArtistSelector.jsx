import { useState } from "react";
/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

function ArtistSelector({
  artist,
  setArtist,
  artistQuery,
  setArtistQuery,
  getArtistData,
  artistSearchResults,
  isLoading,
  isLoggedIn,
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div>
        <div className="mx-auto font-semibold text-center mb-4">
          <p>Type an artist&apos;s name to see their chart history!</p>
        </div>
        <div className="flex flex-col items-center mx-auto md:w-[500px] w-full space-y-4">
          <Command className={"py-10"}>
            <CommandInput
              placeholder={
                isLoggedIn
                  ? "Search for an artist..."
                  : "Connect with Spotify to search for artists!"
              }
              value={artistQuery}
              onValueChange={(value) => setArtistQuery(value)}
              className={"h-12 text-lg px-4"}
              onFocus={() => setIsOpen(true)} // open dropdown when input focused
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              disabled={!isLoggedIn}
            />
            {isOpen && (
              <CommandList>
                <CommandEmpty>No artists found.</CommandEmpty>
                <CommandGroup heading="Artists">
                  {artistSearchResults.map((artist) => (
                    <CommandItem
                      key={artist.id}
                      className={"h-12 text-lg px-4"}
                      value={artist.name}
                      onSelect={() => {
                        setArtist(artist.name);
                        setArtistQuery(artist.name);
                      }}
                    >
                      <img
                        src={
                          artist.images.length
                            ? artist.images.slice(-1)[0].url
                            : null
                        }
                        width={40}
                        height={40}
                        alt="album artwork"
                      ></img>
                      {artist.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
          <Button
            disabled={artist ? (isLoading ? true : false) : true}
            onClick={getArtistData}
          >
            Get Artist Data
          </Button>
        </div>
      </div>
    </>
  );
}

export default ArtistSelector;
