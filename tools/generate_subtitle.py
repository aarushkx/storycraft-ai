import os
import subprocess


class SubtitleGenerator:
    def __init__(self, base_dir="../bucket/assets"):
        self.base_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), base_dir))
        os.makedirs(self.base_dir, exist_ok=True)

    def generate(self, audio_filename):
        audio_path = os.path.join(self.base_dir, audio_filename)

        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        try:
            result = subprocess.run([
                "auto_subtitle",
                audio_path,
                "-o", self.base_dir,
                "--srt_only", "true"
            ], check=True, capture_output=True, text=True)

            print("Subtitles generated successfully!")
            print(result.stdout)

            base_name = os.path.splitext(audio_filename)[0]
            subtitle_path = os.path.join(self.base_dir, base_name + ".srt")
            return subtitle_path
        except subprocess.CalledProcessError as e:
            print(f"Error generating subtitles:\n{e.stderr}")
            raise
