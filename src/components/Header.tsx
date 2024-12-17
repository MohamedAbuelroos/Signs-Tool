import DownloadIcon from "@mui/icons-material/Download";
import HomeIcon from "@mui/icons-material/Home";
import { useAuth } from "../authContext";

const Header = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const { user } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-around items-center">
        <h1 className="text-2xl">
          <span>{user ? `${user.role}` : "Signs Converter App"}</span>
          <br />
          {user && (
            <>
              <span className="">{formattedDate}, </span>
              <span className="">{formattedTime}</span>
            </>
          )}
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a
                href="/"
                className="flex gap-1 items-center space-x-1 bg-white text-blue-600 py-1 px-3 rounded hover:bg-blue-100 transition"
              >
                <HomeIcon />
                Home
              </a>
            </li>
            {user ? (
              <>
                <li>
                  <a
                    href="https://tools.pdf24.org/en/creator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 bg-white text-blue-600 py-1 px-3 rounded hover:bg-blue-100 transition"
                  >
                    <DownloadIcon />
                    <span>Download PDF Tool</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/monthly-sheet.xlsx"
                    download
                    className="flex items-center space-x-1 bg-white text-blue-600 py-1 px-3 rounded hover:bg-blue-100 transition"
                  >
                    <DownloadIcon />
                    <span>Download Monthly Sheet</span>
                  </a>
                </li>
              </>
            ) : null}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;