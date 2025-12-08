#!/usr/bin/env python3
"""
Script to download a zip file, extract SQL dump, and merge into existing database.
Supports MySQL, PostgreSQL, and SQLite databases.
"""

import os
import sys
import zipfile
import requests
import subprocess
import argparse
import pymysql
import shutil
from pathlib import Path

def download_file(url, destination):
    """Download file from URL to destination path."""
    print(f"Downloading from {url}...")
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(destination, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"Downloaded to {destination}")
        return True
    except Exception as e:
        print(f"Error downloading file: {e}")
        return False

def unzip_file(zip_path, extract_to):
    """Extract zip file to specified directory."""
    print(f"Extracting {zip_path}...")
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        print(f"Extracted to {extract_to}")
        return True
    except Exception as e:
        print(f"Error extracting zip: {e}")
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
    
def copy_files(source_dir, destination_dir):
    try:
        shutil.move(source_dir, destination_dir)
        return True
    except Exception as e:
        print(f"Error copying files: {e}")
        return False

def cleanup(download_dir):
    """Clean up downloaded and extracted files."""
    print("Cleaning up temporary files...")
    try:
        if os.path.exists(download_dir):
            shutil.rmtree(download_dir)
        print("Cleanup complete!")
    except Exception as e:
        print(f"Error during cleanup: {e}")

def main():
    parser = argparse.ArgumentParser(description='Download, extract, and import SQL database dump')
    parser.add_argument('url', help='URL of the zip file to download')
    parser.add_argument('destination_path', help='Path where the content of the archive should be extracted to.')
    parser.add_argument('--host', default='localhost', help='Database host (default: localhost)')
    parser.add_argument('--port', default=3306, type=int, help='Database port')
    parser.add_argument('--database', default="minodu", help='Database name')
    parser.add_argument('--user', help='Database user')
    parser.add_argument('--password', help='Database password')
    
    args = parser.parse_args()
    
    # Create download directory
    download_dir = Path.cwd() / "tmp"
    download_dir.mkdir(parents=True, exist_ok=True)
    
    zip_path = download_dir / "download.zip"
    extract_dir = download_dir / "extracted"
    
    # Download zip file
    if not download_file(args.url, zip_path):
        return 1
    
    # Extract zip file
    if not unzip_file(zip_path, extract_dir):
        cleanup(download_dir)
        return 1
    
    # Find SQL file
    sql_file = extract_dir / "db_dump.sql"
    if not sql_file:
        print("Error: No SQL file found in extracted contents")
        cleanup(download_dir)
        return 1
    
    # import sql dump
    if not import_mysql(sql_file, args.host, args.database, args.user, args.password, args.port):
        cleanup(download_dir)
        return 1

    # copy files
    destination_path = Path(args.destination_path)
    destination_path = destination_path if destination_path.is_absolute() else Path.cwd() / destination_path
    if not copy_files(extract_dir.resolve(), destination_path.resolve()):
        cleanup(download_dir)
        return 1
        
    # Cleanup
    cleanup(download_dir)

    return 0

if __name__ == '__main__':
    sys.exit(main())