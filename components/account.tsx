import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

interface AccountProps {
  isLoading: boolean;
}

export const Account: React.FC<AccountProps> = ({ isLoading }) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      <Button
        className="text-white h-12 px-4 py-2 rounded-none"
        onClick={() => disconnect()}
        disabled={isLoading}
      >
        {" "}
        {address}
      </Button>
    </div>
  );
};
