import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";

const ConnectButton = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Connect to Spotify</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby="dialog-description"
        >
          <DialogHeader>
            <DialogTitle>Privacy Policy and EUA</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div id="dialog-description">
            <p>
              By connecting your Spotify account with Playlist Rewind, you agree
              to our{" "}
              <a
                href="https://github.com/RyanMagyar/billboard-rewind/blob/master/Privacy.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                privacy policy
              </a>{" "}
              and{" "}
              <a
                href="https://github.com/RyanMagyar/billboard-rewind/blob/master/EndUser.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                end user agreement
              </a>
              .
            </p>
            <br></br>
            <p>
              You can disconnect your account from this application at any time
              via{" "}
              <a
                href="https://www.spotify.com/account/apps/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Spotify&apos;s app permissions page.
              </a>
            </p>
            <br></br>
          </div>
          <DialogFooter>
            <div className="mx-auto">
              <a href={`${import.meta.env.VITE_API_URL}/auth/login`}>
                <Button>Connect to Spotify</Button>
              </a>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectButton;
