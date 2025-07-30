# Kokoro TTS

A CLI text-to-speech tool using the Kokoro model, supporting multiple languages, voices (with blending), and various input formats including EPUB books and PDF documents.

![ngpt-s-c](https://raw.githubusercontent.com/nazdridoy/kokoro-tts/main/previews/kokoro-tts-h.png)

## Features

- Multiple language and voice support
- Voice blending with customizable weights
- EPUB, PDF and TXT file input support
- Standard input (stdin) and `|` piping from other programs
- Streaming audio playback
- Split output into chapters
- Adjustable speech speed
- WAV and MP3 output formats
- Chapter merging capability
- Detailed debug output option
- GPU Support

## Demo

Kokoro TTS is an open-source CLI tool that delivers high-quality text-to-speech right from your terminal. Think of it as your personal voice studio, capable of transforming any text into natural-sounding speech with minimal effort.

https://github.com/user-attachments/assets/8413e640-59e9-490e-861d-49187e967526

[Demo Audio (MP3)](https://github.com/nazdridoy/kokoro-tts/raw/main/previews/demo.mp3) | [Demo Audio (WAV)](https://github.com/nazdridoy/kokoro-tts/raw/main/previews/demo.wav)

## TODO

- [x] Add GPU support
- [x] Add PDF support
- [ ] Add GUI

## Prerequisites

- Python 3.12

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nazdridoy/kokoro-tts.git
cd kokoro-tts
```

2. Install required packages:

It is recommended to use a virtual environment to avoid dependency conflicts.

**With `uv` (recommended):**
```bash
uv venv
uv sync
```
**With `pip`:**
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Note: You can also use `uv` as a faster alternative to pip for package installation. (This is a uv project)
Note: Python>=3.13 is not currently supported.

3. Download the required model files:
```bash
# Download either voices.json or voices.bin (bin is preferred)
wget https://github.com/nazdridoy/kokoro-tts/releases/download/v1.0.0/voices-v1.0.bin

# Download the model
wget https://github.com/nazdridoy/kokoro-tts/releases/download/v1.0.0/kokoro-v1.0.onnx
```
Note: The script will automatically use voices.bin if present, falling back to voices.json if bin is not available.


## Supported voices:

| **Category** | **Voices** | **Language Code** |
| --- | --- | --- |
| 🇺🇸 👩 | af\_alloy, af\_aoede, af\_bella, af\_heart, af\_jessica, af\_kore, af\_nicole, af\_nova, af\_river, af\_sarah, af\_sky | **en-us** |
| 🇺🇸 👨 | am\_adam, am\_echo, am\_eric, am\_fenrir, am\_liam, am\_michael, am\_onyx, am\_puck | **en-us** |
| 🇬🇧 | bf\_alice, bf\_emma, bf\_isabella, bf\_lily, bm\_daniel, bm\_fable, bm\_george, bm\_lewis | **en-gb** |
| 🇫🇷 | ff\_siwis | **fr-fr** |
| 🇮🇹 | if\_sara, im\_nicola | **it** |
| 🇯🇵 | jf\_alpha, jf\_gongitsune, jf\_nezumi, jf\_tebukuro, jm\_kumo | **ja** |
| 🇨🇳 | zf\_xiaobei, zf\_xiaoni, zf\_xiaoxiao, zf\_xiaoyi, zm\_yunjian, zm\_yunxi, zm\_yunxia, zm\_yunyang | **cmn** |


## Usage

Basic usage:
```bash
./kokoro-tts <input_text_file> [<output_audio_file>] [options]
```

> [!NOTE]
> If you have installed the dependencies in a virtual environment, you need to either activate it first (e.g., `source .venv/bin/activate`) or use `uv run` to execute the commands.

### Commands

- `-h, --help`: Show help message
- `--help-languages`: List supported languages
- `--help-voices`: List available voices
- `--merge-chunks`: Merge existing chunks into chapter files

### Options

- `--stream`: Stream audio instead of saving to file
- `--speed <float>`: Set speech speed (default: 1.0)
- `--lang <str>`: Set language (default: en-us)
- `--voice <str>`: Set voice or blend voices (default: interactive selection)
  - Single voice: Use voice name (e.g., "af_sarah")
  - Blended voices: Use "voice1:weight,voice2:weight" format
- `--split-output <dir>`: Save each chunk as separate file in directory
- `--format <str>`: Audio format: wav or mp3 (default: wav)
- `--debug`: Show detailed debug information during processing

### Input Formats

- `.txt`: Text file input
- `.epub`: EPUB book input (will process chapters)
- `.pdf`: PDF document input (extracts chapters from TOC or content)

### Examples

```bash
# Basic usage with output file
kokoro-tts input.txt output.wav --speed 1.2 --lang en-us --voice af_sarah

# Read from standard input (stdin)
echo "Hello World" | uv run kokoro-tts /dev/stdin --stream
cat input.txt | kokoro-tts /dev/stdin output.wav

# Use voice blending (60-40 mix) (with uv run)
uv run kokoro-tts input.txt output.wav --voice "af_sarah:60,am_adam:40"

# Use voice blending (60-40 mix)
kokoro-tts input.txt output.wav --voice "af_sarah:60,am_adam:40"

# Use equal voice blend (50-50)
kokoro-tts input.txt --stream --voice "am_adam,af_sarah"

# Process EPUB and split into chunks
kokoro-tts input.epub --split-output ./chunks/ --format mp3

# Stream audio directly
kokoro-tts input.txt --stream --speed 0.8

# Merge existing chunks
kokoro-tts --merge-chunks --split-output ./chunks/ --format wav

# Process EPUB with detailed debug output
kokoro-tts input.epub --split-output ./chunks/ --debug

# Process PDF and split into chapters
kokoro-tts input.pdf --split-output ./chunks/ --format mp3
# List available voices
kokoro-tts --help-voices

# List supported languages
kokoro-tts --help-languages
```

## Features in Detail

### EPUB Processing
- Automatically extracts chapters from EPUB files
- Preserves chapter titles and structure
- Creates organized output for each chapter
- Detailed debug output available for troubleshooting

### Audio Processing
- Chunks long text into manageable segments
- Supports streaming for immediate playback
- Voice blending with customizable mix ratios
- Progress indicators for long processes
- Handles interruptions gracefully

### Output Options
- Single file output
- Split output with chapter organization
- Chunk merging capability
- Multiple audio format support

### Debug Mode
- Shows detailed information about file processing
- Displays NCX parsing details for EPUB files
- Lists all found chapters and their metadata
- Helps troubleshoot processing issues

### Input Options
- Text file input (.txt)
- EPUB book input (.epub)
- Standard input (stdin)
- Supports piping from other programs

## Contributing

This is a personal project. But if you want to contribute, please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Kokoro-ONNX](https://github.com/thewh1teagle/kokoro-onnx)
