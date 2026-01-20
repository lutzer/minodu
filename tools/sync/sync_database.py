#!/usr/bin/env python3
"""
Script to download a zip file, extract SQL dump, and merge into existing database.
Supports MySQL, PostgreSQL, and SQLite databases.
"""

import hashlib
import os
import sys
import subprocess
import argparse
import pymysql
import shutil
from pathlib import Path

def check_file_hash(file_path):
    """Calculate hash of a file"""
    hash_obj = hashlib.new("sha256")
    
    with open(file_path, 'rb') as f:
        # Read file in chunks to handle large files efficiently
        for chunk in iter(lambda: f.read(4096), b''):
            hash_obj.update(chunk)
    
    hash = hash_obj.hexdigest()
    print(f"Hash: {hash}" )

def download_and_extract(url, extract_to, download_path='./download.zip', keep_file=True):
    """Download to temp file, then extract and delete"""
    print(f"Downloading file from {url} to {download_path}...")
    try:
        if not Path(Path.cwd() / download_path).exists():
            # Download with curl
            subprocess.run(
                ['curl', '-L', '--progress-bar', '-o', download_path, url],
                check=True
            )
        
        # Extract
        subprocess.run(
            ['unzip', '-q', download_path, '-d', extract_to],
            check=True
        )
        
        # Clean up
        if not keep_file:
            os.remove(download_path)
        
        print(f"Downloaded and extracted to {extract_to}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        if os.path.exists(download_path):
            os.remove(download_path)
        return False

def import_mysql(sql_file, host, database, user, password, port=3306):
    """Import SQL dump into MySQL database using PyMySQL."""
    print(f"Importing into MySQL database '{database}'...")
    
    try:
        # Connect to MySQL
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Read and execute SQL file
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Split by semicolons and execute each statement
        statements = sql_content.split(';')
        
        for i, statement in enumerate(statements):
            statement = statement.strip()
            if statement:
                try:
                    cursor.execute(statement)
                except Exception as e:
                    print(f"Warning on statement {i+1}: {e}")
                    # Continue with other statements
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print("Import successful!")
        return True
        
    except Exception as e:
        print(f"Error during import: {e}")
        return False
    
def copy_files(source_dir: Path, destination_dir: Path) -> bool:
    """
    Copy audios, images, and docs directories from source to destination.
    """
    try:
        source_dir = Path(source_dir)
        destination_dir = Path(destination_dir)
        destination_dir.mkdir(parents=True, exist_ok=True)

        directories = ['audios', 'images', 'docs']

        for dir_name in directories:
            src = source_dir / dir_name
            dest = destination_dir / dir_name

            if src.exists() and src.is_dir():
                if dest.exists():
                    shutil.rmtree(dest)
                shutil.copytree(src, dest)
                file_count = len(list(dest.iterdir()))
                print(f"  - {dir_name}: {file_count} files")
            else:
                print(f"  - {dir_name}: not found in source")

        print(f"Files copied to {destination_dir}")
        return True
    except Exception as e:
        print(f"Error copying files: {e}")
        return False

def cleanup(dir):
    """Clean up downloaded and extracted files."""
    print("Cleaning up temporary files...")
    try:
        if os.path.exists(dir):
            shutil.rmtree(dir)
        print("Cleanup complete!")
    except Exception as e:
        print(f"Error during cleanup: {e}")

def main():
    parser = argparse.ArgumentParser(description='Download, extract, and import SQL database dump')
    parser.add_argument('url', help='URL of the zip file to download')
    parser.add_argument('--destination', required=True, help='Base path for file distribution (files go to destination/audios, destination/images, destination/docs)')
    parser.add_argument('--host', default='localhost', help='Database host (default: localhost)')
    parser.add_argument('--port', default=3306, type=int, help='Database port')
    parser.add_argument('--database', default="minodu", help='Database name')
    parser.add_argument('--user', required=True, help='Database user')
    parser.add_argument('--password', required=True, help='Database password')
    parser.add_argument('--keep_file', default=True, help='Keep downloaded file')
    
    args = parser.parse_args()

    download_path = Path.cwd() / "download.zip"

    # check if file with the right hash is already downloaded
    # check_file_hash(download_path)
    
    # Create extract directory
    extract_dir = Path.cwd() / "extracted/"
    extract_dir.mkdir(parents=True, exist_ok=True)

    # Download zip file and extract
    if not download_and_extract(args.url, extract_dir, download_path=download_path, keep_file=args.keep_file):
        cleanup(extract_dir)
        return 1
    
    # Find SQL file
    sql_file = extract_dir / "db_dump.sql"
    if not sql_file:
        print("Error: No SQL file found in extracted contents")
        cleanup(extract_dir)
        return 1
    
    # import sql dump
    if not import_mysql(sql_file, args.host, args.database, args.user, args.password, args.port):
        cleanup(extract_dir)
        return 1

    # Copy files to destination
    destination = Path(args.destination)
    destination_path = destination if destination.is_absolute() else Path.cwd() / destination
    if not copy_files(extract_dir.resolve(), destination_path.resolve()):
        cleanup(extract_dir)
        return 1

    # Cleanup
    cleanup(extract_dir)

    return 0

if __name__ == '__main__':
    sys.exit(main())