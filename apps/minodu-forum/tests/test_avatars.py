import json
import mimetypes
import os

from fastapi.testclient import TestClient
import pytest

from minodu_forum.src.app import app
from minodu_forum.src.database import get_db_session
from minodu_forum.src.models.avatar import Avatar, create_avatar_table
from minodu_forum.src.utils import get_avatar_file_path

script_dir = os.path.dirname(os.path.abspath(__file__))

def list_avatars(client) -> dict:
    response = client.get("/avatars")
    return response.json()

def test_create_avatar_table():
    create_avatar_table()

    with get_db_session() as db:
        results = db.query(Avatar).all()
        assert len(results) > 0

def test_list_avatars(client):
    response = client.get("/avatars")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 1

def test_get_static_uploaded_avatar(client):
    avatars = list_avatars(client)
    response = client.get(app.root_path + "/static/avatars/" + avatars[0]["filename"])

    assert response.status_code == 200
    assert "image/jpeg" in response.headers["content-type"]
    assert len(response.content) > 0

def test_get_static_uploaded_avatar_urlpath(client):
    response = client.get("/avatars")
    assert response.status_code == 200
    data = response.json()
    assert len(data[0]["file_urlpath"]) > 0

def test_avatar_file_exists(client):
    avatars = list_avatars(client)
    response = client.get(avatars[0]['file_urlpath'])
    assert response.headers["content-type"].startswith("image")
    assert response.status_code == 200

# @pytest.mark.skip("Skip avatar tests for now")
# class TestAvatarsApi:
    
#     def test_create_avatar(self):

#         file_path = os.path.join(script_dir, "files/laura.jpeg")
#         with open(file_path, "rb") as f:
#             response = client.post(
#                 "/avatars/create", files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])}
#             )

#         print(response.text)
#         assert response.status_code == 200
#         data = response.json()
#         assert data["content_type"].startswith("image")
#         assert os.path.isfile(get_avatar_file_path(data["filename"]))

#     def test_fail_to_create_avatar_wrong_filetype(self):
#         file_path = os.path.join(script_dir, "files/french_sample.mp3")
#         with open(file_path, "rb") as f:
#             response = client.post(
#                 "/avatars/create", files={"file": (os.path.basename(file_path), f, mimetypes.guess_type(file_path)[0])}
#             )
#         assert response.status_code != 200

#     def test_list_avatars(self):
#         file_path = os.path.join(script_dir, "files/laura.jpeg")
#         create_avatar(file_path)
#         create_avatar(file_path)

#         response = client.get("/avatars")

#         assert response.status_code == 200
#         data = response.json()
#         assert len(data) == 2

#     def test_delete_avatar(self):
#         file_path = os.path.join(script_dir, "files/laura.jpeg")
#         avatar = create_avatar(file_path)

#         assert os.path.isfile(get_avatar_file_path(avatar["filename"]))

#         response = client.delete(f"/avatars/{avatar['id']}")

#         assert response.status_code == 200
#         assert not os.path.isfile(get_avatar_file_path(avatar["filename"]))

#     def test_get_static_uploaded_avatar(self):
#         file_path = os.path.join(script_dir, "files/laura.jpeg")
#         avatar = create_avatar(file_path)

#         response = client.get(app.root_path + "/static/avatars/" + avatar["filename"])

#         assert response.status_code == 200
#         assert "image/jpeg" in response.headers["content-type"]
#         assert len(response.content) > 0

#     def test_get_static_uploaded_avatar_urlpath(self):
#         file_path = os.path.join(script_dir, "files/laura.jpeg")
#         create_avatar(file_path)

#         response = client.get("/avatars")

#         assert response.status_code == 200
#         data = response.json()
#         assert len(data[0]["file_urlpath"]) > 0
