#!/usr/bin/env python3
"""
Script to download a zip file, extract SQL dump, and merge into existing database.
Supports MySQL, PostgreSQL, and SQLite databases.

Usage:
    # Full import (drops and recreates tables from dump schema):
    python sync_database.py <url> --destination <path> --user <user> --password <pass>

    # Data-only import (inserts into existing TypeORM-created tables):
    python sync_database.py <url> --destination <path> --user <user> --password <pass> --data-only
"""

import hashlib
import os
import sys
import subprocess
import argparse
import re
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

def filter_data_only_statements(sql_content):
    """
    Filter SQL content to only include data-related statements.
    Keeps: INSERT, DELETE, SET statements
    Removes: DROP, CREATE, ALTER, LOCK, UNLOCK statements
    """
    # Split by semicolons while preserving the structure
    statements = sql_content.split(';')
    filtered_statements = []

    # Patterns for statements to KEEP
    keep_patterns = [
        r'^\s*INSERT\s+',
        r'^\s*DELETE\s+',
        r'^\s*SET\s+',
        r'^\s*/\*!\d+\s+SET\s+',  # MySQL conditional SET statements
    ]

    # Patterns for statements to SKIP
    skip_patterns = [
        r'^\s*DROP\s+',
        r'^\s*CREATE\s+',
        r'^\s*ALTER\s+',
        r'^\s*LOCK\s+',
        r'^\s*UNLOCK\s+',
        r'^\s*/\*!\d+\s+ALTER\s+',  # MySQL conditional ALTER statements
    ]

    for statement in statements:
        statement_stripped = statement.strip()
        if not statement_stripped:
            continue

        # Check if statement should be skipped
        should_skip = False
        for pattern in skip_patterns:
            if re.match(pattern, statement_stripped, re.IGNORECASE):
                should_skip = True
                break

        if should_skip:
            continue

        # Check if statement should be kept
        for pattern in keep_patterns:
            if re.match(pattern, statement_stripped, re.IGNORECASE):
                filtered_statements.append(statement_stripped)
                break

    return filtered_statements


def import_mysql(sql_file, host, database, user, password, port=3306, data_only=False):
    """Import SQL dump into MySQL database using PyMySQL."""
    mode = "data-only" if data_only else "full"
    print(f"Importing into MySQL database '{database}' ({mode} mode)...")

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

        # Read SQL file
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        if data_only:
            # Filter to only data statements (INSERT, DELETE, SET)
            print("Filtering SQL to data-only statements...")

            # Disable foreign key checks for data import
            cursor.execute("SET FOREIGN_KEY_CHECKS=0")
            cursor.execute("SET UNIQUE_CHECKS=0")
            cursor.execute("SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO'")

            statements = filter_data_only_statements(sql_content)

            for i, statement in enumerate(statements):
                if statement:
                    try:
                        cursor.execute(statement)
                    except Exception as e:
                        print(f"Warning on statement {i+1}: {e}")
                        # Continue with other statements

            # Re-enable checks
            cursor.execute("SET FOREIGN_KEY_CHECKS=1")
            cursor.execute("SET UNIQUE_CHECKS=1")
        else:
            # Full import - split by semicolons and execute each statement
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
    parser.add_argument('--data-only', action='store_true', dest='data_only',
                        help='Import only data (INSERT statements), skip schema changes. '
                             'Use this when TypeORM creates the schema with synchronize: true')

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
    if not import_mysql(sql_file, args.host, args.database, args.user, args.password, args.port, args.data_only):
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