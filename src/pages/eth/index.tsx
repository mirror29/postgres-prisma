import { ConnectKitButton } from "connectkit";
import EthLayout from "../../components/EthLayout";
import { useAccount, useEnsName } from "wagmi";

// // Make sure that this component is wrapped with ConnectKitProvider
const MyComponent = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return <div>Connected Wallet: {address}</div>;
};

export default function Home() {
  return (
    <div>
        <ConnectKitButton />
        <MyComponent />
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <EthLayout>{page}</EthLayout>;
};
