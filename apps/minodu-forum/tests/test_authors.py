import os

import pytest
from fastapi.testclient import TestClient

from minodu_forum.src.app import app
from minodu_forum.src.models.author import Author
from tests.test_avatars import list_avatars

script_dir = os.path.dirname(os.path.abspath(__file__))

# Create test client
client = TestClient(app)


def create_author(client: TestClient, name: str = "test"):
    author_data = {"name": name, "avatar": None}
    response = client.post(app.root_path + "/authors/create", json=author_data)
    return response.json()["token"]

class TestAuthorsApi:

    def test_create_author_without_avatar(self, client):
        author_data = {"name": "Author1", "avatar": None}
        response = client.post(app.root_path + "/authors/create", json=author_data)
        assert response.status_code == 200

        response_data = response.json()
        assert len(response_data["token"]) > 0
        assert response_data["id"] >= 0

    def test_validate_author(self, client):
        with pytest.raises(Exception):
            author = Author(name="12", avatar_id=None).validate()

        author = Author(name="123", avatar_id=None).validate()

    def test_create_author_throws_exception(self, client):
        author_data = {"name": "12", "avatar": None}
        response = client.post(app.root_path + "/authors/create", json=author_data)
        assert response.status_code == 422
        print(response)

    def test_fetch_authors(self, client):
        author_data = {"name": "test", "avatar": None}
        response1 = client.post(app.root_path + "/authors/create", json=author_data)

        response2 = client.get(app.root_path + "/authors/")
        response2_data = response2.json()
        assert response2_data[0]["id"] == response1.json()["id"]

    def test_edit_author_name(self, client):
        old_data = {"name": "old_name"}

        response = client.post(app.root_path + "/authors/create", json=old_data)
        token = response.json()["token"]
        author_id = response.json()["id"]

        new_data = {"name": "new_name"}

        response = client.put(
            app.root_path + f"/authors/{author_id}", json=new_data, headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        assert response.json()["name"] == new_data["name"]

    def test_create_author_with_avatar(self, client):
        avatar = list_avatars(client)[0]

        author_data = {"name": "Author1", "avatar": avatar["id"]}
        response = client.post(app.root_path + "/authors/create", json=author_data)
        assert response.status_code == 200
        author_id = response.json()["id"]

        response = client.get(app.root_path + f"/authors/{author_id}")
        assert response.status_code == 200
        assert response.json()["avatar"] != None

    def test_edit_author_avatar(self, client):
        avatar = list_avatars(client)[0]

        old_data = {"name": "test"}

        response = client.post(app.root_path + "/authors/create", json=old_data)
        assert response.status_code == 200

        token = response.json()["token"]
        author_id = response.json()["id"]

        new_data = {"avatar": avatar["id"]}

        response = client.put(
            app.root_path + f"/authors/{author_id}", json=new_data, headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200

        response = client.get(app.root_path + f"/authors/{author_id}")
        assert response.status_code == 200
        assert response.json()["avatar"]["id"] == new_data["avatar"]

    def test_edit_author_avatar_error(self, client):
        old_data = {"name": "test"}

        response = client.post(app.root_path + "/authors/create", json=old_data)
        assert response.status_code == 200

        token = response.json()["token"]
        author_id = response.json()["id"]

        new_data = {"avatar": 99}

        response = client.put(
            app.root_path + f"/authors/{author_id}", json=new_data, headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code != 200

    def test_check_login(self, client):
        authorName = "somerandomusernamel30984"
        token = create_author(client, authorName)

        response = client.get(app.root_path + "/login", headers={"Authorization": f"Bearer {token}"})

        assert response.status_code == 200
        assert response.json()["name"] == authorName

    def test_check_login_fail(self, client):
        authorName = "somerandomusernamel30984"
        token = create_author(client, authorName)

        response = client.get(app.root_path + "/login", headers={"Authorization": f"Bearer {token}dsfdsfsdf"})

        assert response.status_code == 401
