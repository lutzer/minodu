import os

from fastapi.testclient import TestClient

from minodu_forum.src.app import app

from tests.test_posts import create_post
from .test_authors import create_author

script_dir = os.path.dirname(os.path.abspath(__file__))

# Create test client
client = TestClient(app)


class TestAdminApi:

    def test_delete_admin_post(self):
        auth_token = create_author(client)
        post = create_post(client, auth_token, "test")

        headers = {"X-Admin-Password": f"admin_password"}
        response = client.delete(app.root_path + f"/admin/posts/{post['id']}", headers=headers)

        assert response.status_code == 200

        response = client.get(app.root_path + "/posts/")
        assert len(response.json()) == 0

    def test_delete_admin_post_restricted(self, client):
        auth_token = create_author(client)
        post = create_post(client, auth_token, "test")

        headers = {"X-Admin-Password": f"wrongpassword"}
        response = client.delete(app.root_path + f"/admin/posts/{post['id']}", headers=headers)

        assert response.status_code == 403
