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
  getArtistData,
  artistSearchResults,
  isLoading,
}) {
  return (
    <>
      <div>
        <div className="mx-auto font-semibold text-center mb-4">
          <p>Type an artist&apos;s name to see their chart history!</p>
        </div>
        <div className="flex flex-col items-center mx-auto md:w-[500px] w-full space-y-4">
          <Command>
            <CommandInput
              placeholder="Search for an artist..."
              onValueChange={(value) => setArtist(value)}
              className={"w-[300px]"}
            />
            {artistSearchResults !== undefined && (
              <CommandList>
                {isLoading && (
                  <div className="p-2 text-sm text-muted-foreground">
                    Loading…
                  </div>
                )}
                <CommandEmpty>No artists found.</CommandEmpty>
                <CommandGroup heading="Artists">
                  {artistSearchResults.map((artist) => (
                    <CommandItem
                      key={artist.id}
                      value={artist.name}
                      onSelect={() => setArtist(artist)}
                    >
                      {artist.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
          {/* <Input
            type="text"
            value={artist}
            placeholder="Artist"
            onChange={(e) => setArtist(e.target.value)}
            className={"w-[300px]"}
          /> */}
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
