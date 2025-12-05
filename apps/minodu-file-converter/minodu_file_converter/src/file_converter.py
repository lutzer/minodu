import asyncio
from dataclasses import dataclass
import logging
import mimetypes
import os
import queue
import threading
from typing import Callable, Optional
from PIL import Image
from pydub import AudioSegment

# from minodu_forum.src.utils import create_dir_if_not_exists

logger = logging.getLogger(__name__)

class FileConverter:

    @dataclass
    class ConversionJob:
        file_id: int
        output_filepath: str
        tmp_filepath: str
    
    @dataclass
    class ConversionResult:
        file_id: int
        tmp_file: str
        error: Optional[str]

    number_of_workers : int
    max_size : int

    job_queue : queue.Queue[ConversionJob]

    running : bool = False
    workers : list[threading.Thread] = []
    
    stop_event : threading.Event = threading.Event()

    callback_handler : Callable[[ConversionResult],None] 

    def __init__(self, 
            callback_handler : Callable[[ConversionResult], None], 
            max_size : int = 100, 
            number_of_workers : int = 1):
        self.job_queue = queue.Queue()
        self.number_of_workers = number_of_workers
        self.max_size = max_size
        self.callback_handler = callback_handler

    def _ensure_workers_started(self):
        if self.running:
            return
        
        self.stop_event.clear()

        for i in range(self.number_of_workers):
            worker = threading.Thread(target=queue_worker, args=(f"worker-{i}", self.job_queue, self.callback_handler, self.stop_event), daemon=True)
            worker.start()
            self.workers.append(worker)

        self.running = True

    def convert(self, file_id: int, output_filepath: str, tmp_filepath: str):
        self._ensure_workers_started()
        job = FileConverter.ConversionJob(
            file_id = file_id,
            output_filepath = output_filepath,
            tmp_filepath = tmp_filepath
        )
        self.job_queue.put(job)
        logger.info(f"Added convert job to queue: {job}")

    def stop(self):
        self.stop_event.set()
        self.running = False
        for worker in self.workers:
            worker.join()

    def is_working(self):
        return self.running and not self.job_queue.empty()

def queue_worker(
        name: str, 
        queue: queue.Queue[FileConverter.ConversionJob], 
        result_callback : Callable[[FileConverter.ConversionResult], None],
        stop_event : threading.Event):
    """Background worker that processes jobs from the queue"""
        

    while not stop_event.is_set():
        print("worker loop")
        try:
            job = queue.get(block=True)
            process_file(job.file_id, job.output_filepath, job.tmp_filepath)
            result_callback(FileConverter.ConversionResult(job.file_id, job.tmp_filepath, None))
            print("worker result")
        except Exception as e:
            if job:
                result_callback(FileConverter.ConversionResult(job.file_id, job.tmp_filepath, str(e)))
            
            print("worker error" + str(e))
            logger.error(f"Worker {name} encountered error: {e}")

def process_file(file_id: int, output_path: str, tmp_filepath: str):
    logger.info(f"Converting file {tmp_filepath}")

    create_dir_if_not_exists(os.path.dirname(output_path))

    content_type, _ = mimetypes.guess_type(tmp_filepath)

    # if file is image, resize and convert to jpg
    if content_type.startswith("image/"):
        convert_image(tmp_filepath, output_path)

    if content_type.startswith("audio/") or content_type.startswith("video/webm"):
        convert_audio(tmp_filepath, output_path)

def convert_image(input_path: str, output_path: str, max_width: int = 1920, max_height: int = 1080):
    img = Image.open(input_path)

    # Resize if image is larger than max dimensions
    if img.width > max_width or img.height > max_height:
        img.thumbnail((max_width, max_height), Image.LANCZOS)

    # Convert to RGB if necessary (JPEG doesn't support transparency)
    if img.mode in ("RGBA", "LA", "P"):
        rgb_img = Image.new("RGB", img.size, (255, 255, 255))
        rgb_img.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        img = rgb_img

    # Save as JPEG
    img.save(output_path, "JPEG", quality=95)

def convert_audio(input_path: str, output_path: str):
    audio = AudioSegment.from_file(input_path)
    export_params = {"format": "mp3", "bitrate": "128k"}
    audio.export(output_path, **export_params)

def create_dir_if_not_exists(path: str):
    if not os.path.isdir(path):
        os.makedirs(path)