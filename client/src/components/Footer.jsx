const Footer = () => {
  return (
    <div className="w-[100%]">
      <div className="flex justify-center mb-5">
        <a
          className="hover:underline"
          target="_blank"
          href="https://www.spotify.com/account/apps/"
        >
          Disconnect App
        </a>
        <span className="px-2">-</span>
        <a
          href="https://github.com/RyanMagyar/billboard-rewind/blob/master/EndUser.md"
          target="_blank"
          className="hover:underline"
        >
          End User Agreement
        </a>
        <span className="px-2"> - </span>
        <a
          href="https://github.com/RyanMagyar/billboard-rewind/blob/master/Privacy.md"
          target="_blank"
          className="hover:underline"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default Footer;
