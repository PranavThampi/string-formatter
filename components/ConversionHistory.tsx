import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";

interface Conversion {
  input: string;
  output: string;
  timestamp: number;
}

interface ConversionHistoryProps {
  history: Conversion[];
}

export function ConversionHistory({ history }: ConversionHistoryProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      (err) => {
        console.error("Could not copy text:", err);
        toast.error("Failed to copy clipboard", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    );
  };

  return (
    <Card className="max-w-3xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Conversion History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {history.map((item, index) => (
            <div
              key={index}
              className="mb-4 p-2 border-b last:border-b-0 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Input: {item.input.substring(0, 50)}...
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Output: {item.output.substring(0, 50)}...
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(item.output)}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
