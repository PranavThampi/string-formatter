"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ConversionHistory } from "@/components/ConversionHistory"

interface Conversion {
  input: string
  output: string
  timestamp: number
}

const MAX_HISTORY = 10

export default function StringFormatter() {
  const [input, setInput] = useState("")
  const [delimiter, setDelimiter] = useState(",")
  const [startChar, setStartChar] = useState("'")
  const [endChar, setEndChar] = useState("'")
  const [output, setOutput] = useState("")
  const [history, setHistory] = useState<Conversion[]>([])
  const [useNewLine, setUseNewLine] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem("conversionHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const updateHistory = (newConversion: Conversion) => {
    const updatedHistory = [newConversion, ...history.slice(0, MAX_HISTORY - 1)]
    setHistory(updatedHistory)
    localStorage.setItem("conversionHistory", JSON.stringify(updatedHistory))
  }

  const formatStrings = () => {
    const actualDelimiter = useNewLine ? "\n" : delimiter
    const strings = input.split(actualDelimiter)
    const formattedStrings = strings.map((s) => `${startChar}${s.trim()}${endChar}`)
    const result = formattedStrings.join(",")
    setOutput(result)

    const newConversion: Conversion = {
      input,
      output: result,
      timestamp: Date.now(),
    }
    updateHistory(newConversion)

    navigator.clipboard.writeText(result).then(
      () => {
        toast.success("Output copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      },
      (err) => {
        console.error("Could not copy text:", err)
        toast.error("Failed to copy clipboard", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      },
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>String Formatter</CardTitle>
          <CardDescription>Format your list of strings with custom delimiters and wrapping characters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="input">Input Strings</Label>
            <Textarea
              id="input"
              placeholder="Paste your list of strings here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="delimiter">Delimiter</Label>
              <Input
                id="delimiter"
                type="text"
                placeholder="Delimiter"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="mt-1"
                disabled={useNewLine}
              />
            </div>
            <div>
              <Label htmlFor="startChar">Start Character</Label>
              <Input
                id="startChar"
                type="text"
                placeholder="Start Character"
                value={startChar}
                onChange={(e) => setStartChar(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endChar">End Character</Label>
              <Input
                id="endChar"
                type="text"
                placeholder="End Character"
                value={endChar}
                onChange={(e) => setEndChar(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useNewLine"
              checked={useNewLine}
              onCheckedChange={(checked) => setUseNewLine(checked as boolean)}
            />
            <Label htmlFor="useNewLine">Use new line as delimiter</Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <Button onClick={formatStrings} className="w-full">
            Format and Copy to Clipboard
          </Button>
          {output && (
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <Label>Output:</Label>
              <div className="mt-1 font-mono text-sm break-all">{output}</div>
            </div>
          )}
        </CardFooter>
      </Card>
      <ConversionHistory history={history} />
      <ToastContainer />
    </div>
  )
}

