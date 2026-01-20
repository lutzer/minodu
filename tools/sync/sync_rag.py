import argparse
import subprocess
import sys
import requests
from urllib.parse import urlparse

# Path where PDFs are mounted inside the AI services container
CONTAINER_DOCS_PATH = '/app/data/minodu-backend/docs'

def get_filename_from_url(url: str) -> str | None:
    """Extract filename from URL."""
    if not url:
        return None
    parsed = urlparse(url)
    return parsed.path.split('/')[-1]

def main():
    parser = argparse.ArgumentParser(description='Updates llm embeddings from database.')
    parser.add_argument('url', help='url of the backends api route that lists the posts')
    parser.add_argument('container', help='the name of the docker container that runs the vector database')

    args = parser.parse_args()

    try:
        # retrieve data
        response = requests.get(args.url)
        response.raise_for_status()
        data = response.json()
        print(f"Fetched {len(data)} posts from API")
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return 1

    # clear database
    print("Clearing vector database...")
    result = subprocess.run([
        'docker', 'exec', args.container,
        'python', '/app/cli.py', '--remove-all'
    ])
    if result.returncode != 0:
        print("Failed to clear database")
        return 1

    # add new entries to vector database
    success_count = 0
    skip_count = 0
    error_count = 0

    for entry in data:
        post_id = entry.get('id')
        pdf_url = entry.get('attachment_pdf')
        title = entry.get('title', 'Unknown')

        if not pdf_url:
            print(f"  Skipping post {post_id}: no PDF attachment")
            skip_count += 1
            continue

        filename = get_filename_from_url(pdf_url)
        if not filename:
            print(f"  Skipping post {post_id}: invalid PDF URL")
            skip_count += 1
            continue

        filepath = f"{CONTAINER_DOCS_PATH}/{filename}"
        print(f"  Adding post {post_id}: {filename}")

        result = subprocess.run([
            'docker', 'exec', args.container,
            'python', '/app/cli.py', '--add-doc', str(post_id), filepath
        ])

        if result.returncode == 0:
            success_count += 1
        else:
            error_count += 1

    print(f"\nCompleted: {success_count} added, {skip_count} skipped, {error_count} errors")
    return 0

if __name__ == '__main__':
    sys.exit(main())