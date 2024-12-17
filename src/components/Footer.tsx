import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 p-1 fixed bottom-0 w-full">
      <div className="container mx-auto text-center mt-1">
        <p>
          © {new Date().getFullYear()} Signs Converter App. All rights reserved.
        </p>

        <div className="mt-2 flex justify-center items-center space-x-4">
          <span className="font-semibold">Created By Mohamed Rabea</span>

          <a
            title="Send Mail"
            href="mailto:mohamedabuelroos31@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500"
          >
            <EmailIcon />
          </a>
          <a
            title="Send WhatsApp Message"
            href="https://wa.me/+201551917301"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
