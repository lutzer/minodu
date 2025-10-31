import shutil
import pytest
import os
from pathlib import Path
from fastapi.testclient import TestClient
from PIL import Image

from minodu_forum.src.app import app
from minodu_forum.src.database import get_db_connection, get_db
from minodu_forum.src.routers.helpers import get_upload_file_path, convert_image


from .test_authors import create_author
from .test_posts import create_post

import mimetypes

script_dir = os.path.dirname(os.path.abspath(__file__))

# Create test client
client = TestClient(app)

def upload_file(post_id: int, file_path: str, auth_token: str):
    with open(file_path, "rb") as f:
        response = client.post(
            "/files/upload",
            files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])},
            data={"post_id": post_id, "language": "en"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    return response.json()

class TestFilesApi:

    def test_upload_image_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        with open(file_path, "rb") as f:
            response = client.post(
                "/files/upload",
                files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])},
                data={"post_id": post["id"], "language": "en"},
                headers={"Authorization": f"Bearer {auth_token}"}
            )
        assert response.status_code == 200
        data = response.json()
        assert data["content_type"].startswith("image")
        assert os.path.isfile(get_upload_file_path(data["filename"]))

    def test_upload_image_png(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/sample.png")
        data = upload_file(post["id"], file_path, auth_token)
        assert data["content_type"].startswith("image")
        assert os.path.isfile(get_upload_file_path(data["filename"]))

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
                headers={"Authorization": f"Bearer {auth_token}"}
            )
        assert response.status_code == 200
        data = response.json()
        assert data["content_type"].startswith("audio")
        assert os.path.isfile(get_upload_file_path(data["filename"]))

    def test_upload_wrong_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg.zip")
        with open(file_path, "rb") as f:
            response = client.post(
                "/files/upload",
                files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])},
                data={"post_id": post["id"], "language": "en"},
                headers={"Authorization": f"Bearer {auth_token}"}
            )
        assert response.status_code == 500


    def test_attach_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post['id'],file_path, auth_token)

        response = client.get(app.root_path + "/posts/")        
        assert response.status_code == 200
        response_data = response.json()
        assert response_data[0]["files"][0]['filename'] == file["filename"]

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
                headers={"Authorization": f"Bearer {auth_token2}"}
            )
        assert response.status_code == 401

    def test_delete_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post['id'],file_path, auth_token)

        assert os.path.isfile(get_upload_file_path(file['filename']))
    
        response = client.delete(
            f"/files/{file['id']}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        assert not os.path.isfile(get_upload_file_path(file['filename']))

    def test_delete_file_restricted(self):
        auth_token = create_author()
        auth_token2 = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post['id'],file_path, auth_token)
    
        response = client.delete(
            f"/files/{file['id']}",
            headers={"Authorization": f"Bearer {auth_token2}"}
        )

        assert response.status_code == 401

    def test_delete_post_deletes_files(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post['id'], file_path, auth_token)
        
        assert os.path.isfile(get_upload_file_path(file['filename']))

        response = client.delete(
            f"/posts/{post['id']}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        assert not os.path.isfile(get_upload_file_path(file['filename']))

    def test_get_static_file(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post['id'], file_path, auth_token)
        
        response = client.get(app.root_path + "/static/files/" + file["filename"])

        assert response.status_code == 200
        assert "image/jpeg" in response.headers["content-type"]
        assert len(response.content) > 0

    def test_if_filemodel_has_url_path(self):
        auth_token = create_author()
        post = create_post(auth_token, "fetch_test")

        file_path = os.path.join(script_dir, "files/laura.jpeg")
        file = upload_file(post['id'],file_path, auth_token)

        assert len(file["file_urlpath"]) > 0

    @pytest.mark.asyncio
    async def test_convert_image_to_jpg_and_resize(self):
        # Setup: Define paths
        source_image = os.path.join(script_dir, "files/sample.png")
        temp_image = os.path.join(script_dir, "files/tmp.png")

        converted_image = ""
        
        try:
            # Copy the original image to temp location
            shutil.copy(source_image, temp_image)
            assert Path(temp_image).exists(), "Failed to copy source image"
            
            # Run your conversion function
            # Replace this with your actual conversion function
            converted_image = await convert_image(temp_image, max_width=100, max_height=100)
            
            # Check if converted file exists
            assert Path(converted_image).exists(), "Converted image was not created"
            
            # Verify file extension
            assert Path(converted_image).suffix == ".jpg", f"Expected .jpg extension, got {converted_image.suffix}"
            
            # Verify dimensions
            with Image.open(converted_image) as img:
                width, height = img.size
                assert width <= 100, f"Expected width lower than 100, got {width}"
                assert height <= 100, f"Expected height lower than 100, got {height}"
        finally:
            # Cleanup: Delete temporary files
            if Path(temp_image).exists():
                Path(temp_image).unlink()
            if len(converted_image) > 0 and Path(converted_image).exists():
                Path(converted_image).unlink()
    