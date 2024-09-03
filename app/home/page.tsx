"use client"
import Image from 'next/image';
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, Download, Maximize2, AlertCircle, LogOut } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Replicate from "replicate"

export default function Component() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [moodValue, setMoodValue] = useState(50)
  const [remainingAttempts, setRemainingAttempts] = useState(5)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [aspectRatio, setAspectRatio] = useState("")
  const [colorPalette, setColorPalette] = useState(["#000000", "#000000", "#000000"])

  const replicate = new Replicate({
    auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN || '',
  })

  const handleGenerate = async () => {
    if (remainingAttempts > 0) {
      setIsGenerating(true)
      setRemainingAttempts(remainingAttempts - 1)

      try {
        console.log("Starting image generation...")
        const moodDescription = moodValue < 33 ? "calm" : moodValue < 66 ? "balanced" : "energetic"
        const fullPrompt = `${prompt}, ${style} style, ${moodDescription} mood, color palette: ${colorPalette.join(', ')}, aspect ratio ${aspectRatio}`
        console.log("Full prompt:", fullPrompt)

        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            aspectRatio,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log("API response:", data)

        if (Array.isArray(data.images) && data.images.length > 0) {
          setGeneratedImages(data.images)
          console.log("Images generated successfully:", data.images)
        } else {
          console.error("Unexpected API response format:", data)
          alert("Unexpected response from the image generation API. Please try again.")
        }
      } catch (error) {
        console.error("Error generating images:", error)
        alert(`An error occurred while generating images: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const handleLogout = () => {
    // Implement logout logic here
    console.log("User logged out")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-bold">Text-to-Image Generator</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-1/3 p-6 border-r overflow-y-auto">
          <div className="space-y-6">
            <div>
              <Label htmlFor="prompt">Image Description</Label>
              <Input 
                id="prompt" 
                placeholder="Enter your image description here" 
                className="mt-1" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="style">Aesthetic Style</Label>
              <Select onValueChange={(value) => setStyle(value)}>
                <SelectTrigger id="style" className="mt-1">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photorealistic">Photorealistic</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="oil-painting">Oil Painting</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select onValueChange={(value) => setAspectRatio(value)}>
                <SelectTrigger id="aspect-ratio" className="mt-1">
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Color Palette</Label>
              <div className="flex space-x-2 mt-1">
                {colorPalette.map((color, index) => (
                  <Input 
                    key={index}
                    type="color" 
                    className="w-10 h-10 p-1 rounded" 
                    value={color}
                    onChange={(e) => {
                      const newPalette = [...colorPalette]
                      newPalette[index] = e.target.value
                      setColorPalette(newPalette)
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="mood">Mood/Tone</Label>
              <div className="flex items-center mt-1">
                <span className="text-sm text-muted-foreground">Calm</span>
                <Slider
                  id="mood"
                  min={0}
                  max={100}
                  step={1}
                  className="mx-2 flex-grow"
                  value={[moodValue]}
                  onValueChange={(value) => setMoodValue(value[0])}
                />
                <span className="text-sm text-muted-foreground">Energetic</span>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-1">
                Current: {moodValue < 33 ? "Calm" : moodValue < 66 ? "Balanced" : "Energetic"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Remaining Attempts</Label>
                <span className="text-sm font-medium">{remainingAttempts} / 5</span>
              </div>
              <Progress value={(remainingAttempts / 5) * 100} className="h-2" />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || remainingAttempts === 0}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : remainingAttempts === 0 ? (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  No attempts left
                </>
              ) : (
                "Generate"
              )}
            </Button>
            {remainingAttempts === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                You&apos;ve used all your generation attempts. Please try again later.
              </p>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-2/3 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Generated image ${index + 1}`}
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg cursor-pointer"
                  onClick={() => setEnlargedImage(image)}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    // Download logic here
                    const link = document.createElement('a')
                    link.href = image
                    link.download = `generated-image-${index + 1}.png`
                    link.click()
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative max-w-3xl max-h-[90vh] overflow-auto">
            <Image
              src={enlargedImage}
              alt="Enlarged generated image"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => setEnlargedImage(null)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}