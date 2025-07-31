import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from generate_audio import AudioGenerator

app = FastAPI()


class AudioRequest(BaseModel):
    story: str
    voice: str = "af_heart"


@app.get("/check")
def read_root():
    return {"message": "Server is running"}


@app.post("/generate-audio")
def generate_audio(request: AudioRequest):
    try:
        generator = AudioGenerator(voice=request.voice)
        segments = generator.generate(request.story)
        output_path = generator.save(segments, filename="audio")
        return {"success": True, "path": output_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8001, reload=True)
