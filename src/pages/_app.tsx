require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

export default function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
