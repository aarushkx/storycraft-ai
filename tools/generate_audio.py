import os
import uuid
import numpy as np
import soundfile as sf
from kokoro import KPipeline


class AudioGenerator:
    def __init__(self, voice="af_heart", lang_code="a", output_dir="../bucket/assets", sample_rate=24000):
        self.voice = voice
        self.lang_code = lang_code
        self.sample_rate = sample_rate

        self.output_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), output_dir))
        os.makedirs(self.output_dir, exist_ok=True)

        self.pipeline = KPipeline(lang_code=self.lang_code)

    def generate(self, text: str):
        try:
            generator = self.pipeline(text, voice=self.voice)
            audios = []
            for i, (gs, ps, audio) in enumerate(generator):
                audios.append(audio)
            return audios
        except Exception as e:
            print(f"Error generating audio: {e}")
            raise

    def save(self, audio_segments, filename=None):
        if not audio_segments:
            raise ValueError("No audio segments generated")

        filename = f"{filename}.wav" if filename else f"{uuid.uuid4().hex}.wav"

        output_path = os.path.join(self.output_dir, filename)
        full_audio = np.concatenate(audio_segments)
        sf.write(output_path, full_audio, self.sample_rate)

        return output_path
