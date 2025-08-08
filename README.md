# 🎬 StoryCraftAI

A proof of concept AI-powered platform that transforms stories into captivating videos with AI-generated narration and visuals.

Turn your imagination into stunning videos! StoryCraftAI lets you create engaging story videos by either writing your own tales or generating them with AI, then bringing them to life with AI voices and beautiful background imagery.

## What StoryCraftAI Does

This creative tool makes video storytelling accessible to everyone:

1. **Story Creation** - Write your own story or let AI generate one based on your theme or prompt

2. **AI Narration** - Choose from various AI-generated voices to narrate your story

3. **Visual Magic** - Select AI-generated background images that match your story's mood

4. **Video Generation** - Watch as everything comes together into a polished video ready to share

## Models Used

-   **Audio Generation**: [Kokoro TTS](https://github.com/nazdridoy/kokoro-tts)
-   **Subtitle Generation**: [Auto-Subtitle](https://github.com/m1guelpf/auto-subtitle)
-   **Story Generation**: [Ollama with Llama2](https://ollama.com/library/llama2:7b)

## Getting Started

### Prerequisites

Make sure you have these installed:

-   Node.js (v18 or higher)
-   Python (3.8+)
-   Ollama with Llama2 model
-   FFmpeg (for video processing)

### Installation

1. Clone and navigate to the project

```bash
git clone https://github.com/aarushkx/storycraft-ai.git
cd storycraft-ai
```

2. Set up Python environment

```bash
# Create a virtual environment
python -m venv .venv

# Activate it (Windows)
.venv\Scripts\activate
# Or on Mac/Linux
source .venv/bin/activate

# Install Python dependencies
pip install -r ./backend/tools/requirements.txt
```

3. Install backend dependencies

```bash
cd backend
npm install
```

4. Install Ollama with Llama2

```bash
# Make sure Ollama is installed with the Llama2 model
ollama pull llama2
```

5. Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the Development Server

### Option 1: Run backend and frontend separately

**Backend:**

```bash
cd backend
npm install
npm run dev
npm run py
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

### Option 2: Run everything together (recommended)

```bash
npm run all
```

## Troubleshooting

**FFmpeg Issues**

If you encounter FFmpeg errors (particularly with the auto-subtitle feature), check out this [GitHub issue](https://github.com/m1guelpf/auto-subtitle/issues/93) for solutions and workarounds.

## How It Works

1. **Choose Your Story\*** - Either write your own creative story or provide a theme/prompt for AI generation

2. **Pick Your Voice** - Select from available AI-generated voices that best fit your story's tone

3. **Select Visuals** - Choose AI-generated background images that complement your narrative

4. **Generate Video** - Let StoryCraftAI combine everything into a beautiful, shareable video

## Development Status

This is a proof of concept showcasing the potential of AI in creative video production.

## License

This project is open source and available under the MIT License.
