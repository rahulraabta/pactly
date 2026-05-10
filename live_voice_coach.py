"""
Executive Coach - Live Voice Chat
Real-time voice conversation with AI coach using Gemini Live API

Run with: python live_voice_coach.py
Press Ctrl+C to stop
"""

import asyncio
import os
from google import genai
import pyaudio

# --- API Setup ---
API_KEY = os.environ.get("GOOGLE_API_KEY")
if not API_KEY:
    # Try to read from secrets file
    try:
        import tomli
        with open(".streamlit/secrets.toml", "rb") as f:
            secrets = tomli.load(f)
            API_KEY = secrets.get("GOOGLE_API_KEY")
    except:
        pass

if not API_KEY:
    print("ERROR: GOOGLE_API_KEY not found!")
    print("Set it as environment variable or in .streamlit/secrets.toml")
    exit(1)

client = genai.Client(api_key=API_KEY)

# --- PyAudio config ---
FORMAT = pyaudio.paInt16
CHANNELS = 1
SEND_SAMPLE_RATE = 16000
RECEIVE_SAMPLE_RATE = 24000
CHUNK_SIZE = 1024

pya = pyaudio.PyAudio()

# --- Live API config ---
MODEL = "gemini-2.5-flash-native-audio-preview-12-2025"
CONFIG = {
    "response_modalities": ["AUDIO"],
    "system_instruction": """You are 'The Executioner', a tough but fair VP of Product conducting a mock interview.
Your role is to stress-test the candidate with behavioral interview questions.
Be conversational, give brief critique of their answers, and ask follow-up questions.
Start by introducing yourself and asking: 'Tell me about yourself.'
Keep responses concise - under 30 seconds of speech.""",
}

audio_queue_output = asyncio.Queue()
audio_queue_mic = asyncio.Queue(maxsize=5)
audio_stream = None


async def listen_audio():
    """Listens for audio from microphone and puts it into the queue."""
    global audio_stream
    mic_info = pya.get_default_input_device_info()
    audio_stream = await asyncio.to_thread(
        pya.open,
        format=FORMAT,
        channels=CHANNELS,
        rate=SEND_SAMPLE_RATE,
        input=True,
        input_device_index=mic_info["index"],
        frames_per_buffer=CHUNK_SIZE,
    )
    kwargs = {"exception_on_overflow": False} if __debug__ else {}
    while True:
        data = await asyncio.to_thread(audio_stream.read, CHUNK_SIZE, **kwargs)
        await audio_queue_mic.put({"data": data, "mime_type": "audio/pcm"})


async def send_realtime(session):
    """Sends audio from the mic queue to the Gemini session."""
    while True:
        msg = await audio_queue_mic.get()
        await session.send_realtime_input(audio=msg)


async def receive_audio(session):
    """Receives responses from Gemini and puts audio into the speaker queue."""
    while True:
        turn = session.receive()
        async for response in turn:
            if response.server_content and response.server_content.model_turn:
                for part in response.server_content.model_turn.parts:
                    if part.inline_data and isinstance(part.inline_data.data, bytes):
                        audio_queue_output.put_nowait(part.inline_data.data)
            # Empty the queue on interruption to stop playback
            while not audio_queue_output.empty():
                audio_queue_output.get_nowait()


async def play_audio():
    """Plays audio from the speaker queue."""
    stream = await asyncio.to_thread(
        pya.open,
        format=FORMAT,
        channels=CHANNELS,
        rate=RECEIVE_SAMPLE_RATE,
        output=True,
    )
    while True:
        bytestream = await audio_queue_output.get()
        await asyncio.to_thread(stream.write, bytestream)


async def run():
    """Main function to run the voice chat."""
    print("=" * 50)
    print("  EXECUTIVE COACH - LIVE VOICE CHAT")
    print("=" * 50)
    print()
    print("Connecting to Gemini...")
    
    try:
        async with client.aio.live.connect(
            model=MODEL,
            config=CONFIG
        ) as live_session:
            print("Connected! Start speaking...")
            print("The AI coach will interview you in real-time.")
            print("Press Ctrl+C to end the session.")
            print()
            
            async with asyncio.TaskGroup() as tg:
                tg.create_task(send_realtime(live_session))
                tg.create_task(listen_audio())
                tg.create_task(receive_audio(live_session))
                tg.create_task(play_audio())
                
    except asyncio.CancelledError:
        pass
    finally:
        if audio_stream:
            audio_stream.close()
        pya.terminate()
        print("\nSession ended. Thank you!")


if __name__ == "__main__":
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        print("\nInterrupted by user.")
