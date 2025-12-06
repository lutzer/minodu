import asyncio
import time
import mimetypes
import os
import shutil
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from minodu_forum.src.app import app
from minodu_forum.src.models.file import File
from minodu_forum.src.utils import get_upload_file_path

from .test_authors import create_author
from .test_posts import create_post

script_dir = os.path.dirname(os.path.abspath(__file__))

# Create test client
client = TestClient(app)


def upload_file(post_id: int, file_path: str, auth_token: str, language : str = "en"):
    with open(file_path, "rb") as f:
        response = client.post(
            "/files/upload",
            files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])},
            data={"post_id": post_id, "language": language},
            headers={"Authorization": f"Bearer {auth_token}"},
        )

    data = response.json()

    # wait for file entry is processed
    while data["processing"] == True:
        response = client.get("/files/" + str(data["id"]))
        data = response.json()
        # Wait before next attempt
        time.sleep(0.1)

    return data


class TestFilesApi:

    def test_validate_file(self):
        with pytest.raises(Exception):
            File(filename="", content_type="image/png", file_size=20, file_hash="hash", post_id=1).validate()

        with pytest.raises(Exception):
            File(filename="test", content_type="sth", file_size=20, file_hash="hash", post_id=1).validate()

        File(filename="test", content_type="image/png", file_size=20, file_hash="hash", post_id=1).validate()

        File(filename="test", content_type="audio/wav", file_size=20, file_hash="hash", post_id=1).validate()

    @pytest.mark.timeout(10)
    @pytest.mark.asyncio
    async def test_upload_image_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        with open(file_path, "rb") as f:
            response = client.post(
                "/files/upload",
                files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])},
                data={"post_id": post["id"], "language": "en"},
                headers={"Authorization": f"Bearer {auth_token}"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["content_type"].startswith("image")

        # test if file entry is processed
        while data["processing"] == True:
            response = client.get("/files/" + str(data["id"]))
            data = response.json()
            # Wait before next attempt
            time.sleep(0.1)
        
        # check if file exists
        assert os.path.isfile(get_upload_file_path(data["filename"]))

    def test_upload_image_png(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/sample.png")
        data = upload_file(post["id"], file_path, auth_token)
        assert data["content_type"].startswith("image")
        assert os.path.isfile(get_upload_file_path(data["filename"]))
        assert data["filename"].endswith(".jpg")

    def test_upload_image_webp(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/sample.webp")
        data = upload_file(post["id"], file_path, auth_token)
        assert data["content_type"].startswith("image")
        assert os.path.isfile(get_upload_file_path(data["filename"]))

    def test_upload_audio_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/french_sample.mp3")
        with open(file_path, "rb") as f:
            response = client.post(
                "/files/upload",
                files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])},
                data={"post_id": post["id"], "language": "fr"},
                headers={"Authorization": f"Bearer {auth_token}"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["content_type"].startswith("audio")
        assert os.path.isfile(get_upload_file_path(data["filename"]))

    def test_upload_audio_conversion(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/audios/ff-16b-2c-44100hz.aac")
        data = upload_file(post["id"], file_path, auth_token)

        assert data["content_type"].startswith("audio")
        assert os.path.isfile(get_upload_file_path(data["filename"]))
        assert data["filename"].endswith(".mp3")

    def test_upload_wrong_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg.zip")
        with open(file_path, "rb") as f:
            response = client.post(
                "/files/upload",
                files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])},
                data={"post_id": post["id"], "language": "en"},
                headers={"Authorization": f"Bearer {auth_token}"},
            )
        assert response.status_code == 422

    def test_attach_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post["id"], file_path, auth_token)

        response = client.get(app.root_path + "/posts/")
        assert response.status_code == 200
        response_data = response.json()
        assert response_data[0]["files"][0]["filename"] == file["filename"]

    def test_attach_file_restricted(self):
        auth_token1 = create_author()
        auth_token2 = create_author()
        post = create_post(auth_token1, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        with open(file_path, "rb") as f:
            response = client.post(
                "/files/upload",
                files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])},
                data={"post_id": post["id"], "language": "en"},
                headers={"Authorization": f"Bearer {auth_token2}"},
            )
        assert response.status_code == 401

    def test_delete_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post["id"], file_path, auth_token)

        assert os.path.isfile(get_upload_file_path(file["filename"]))

        response = client.delete(f"/files/{file['id']}", headers={"Authorization": f"Bearer {auth_token}"})

        assert response.status_code == 200
        assert not os.path.isfile(get_upload_file_path(file["filename"]))

    def test_delete_file_restricted(self):
        auth_token = create_author()
        auth_token2 = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post["id"], file_path, auth_token)

        response = client.delete(f"/files/{file['id']}", headers={"Authorization": f"Bearer {auth_token2}"})

        assert response.status_code == 401

    def test_delete_post_deletes_files(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post["id"], file_path, auth_token)

        assert os.path.isfile(get_upload_file_path(file["filename"]))

        response = client.delete(f"/posts/{post['id']}", headers={"Authorization": f"Bearer {auth_token}"})
        assert response.status_code == 200
        assert not os.path.isfile(get_upload_file_path(file["filename"]))

    def test_get_static_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post["id"], file_path, auth_token)

        response = client.get(app.root_path + "/static/files/" + file["filename"])

        assert response.status_code == 200
        assert "image/jpeg" in response.headers["content-type"]
        assert len(response.content) > 0

    def test_if_filemodel_has_url_path(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post["id"], file_path, auth_token)

        assert len(file["file_urlpath"]) > 0
