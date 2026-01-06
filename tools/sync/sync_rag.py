import argparse
import subprocess
import sys
import requests

def main():
    parser = argparse.ArgumentParser(description='Updates llm embeddings from database.')
    parser.add_argument('url', help='url of the backends api route that lists the posts')
    parser.add_argument('container', help='the name of the docker container that runs the vector database')
    
    args = parser.parse_args()

    try:
        # retrieve data
        response = requests.get(args.url)
        data = response.json()
    except Exception as e:
        print(f"Error: {e}")
        return 0


    # clear database
    result = subprocess.run([
        'docker', 'exec', args.container,
        'python', '/app/cli.py', '--remove-all'
    ])
    if result.returncode != 0:
        return 0

    # add new entries to vector database
    for entry in data:
        id = 0
        filepath = "test"
        subprocess.run([
            'docker', 'exec', args.container,
            'python', '/app/cli.py', '--add-doc', str(id), filepath
        ])

    return 0

if __name__ == '__main__':
    sys.exit(main())