import argparse
import sys
from pathlib import Path
from src.vars import LanguageEnum
from src.rag.rag import RAG
from src.rag.document_store import DocumentStore


def main():
    parser = argparse.ArgumentParser(description="CLI Tool to modify minodus llm vector database")
    parser.add_argument("--language", default="fr", help="Conversation language, either en or fr, defaults to french")
    parser.add_argument("--add-doc", nargs=2, metavar=('ID', 'FILEPATH'),
                        help="Add a document with with id and filepath")
    parser.add_argument("--remove-doc", type=int, metavar='ID', help="Removes document")
    parser.add_argument("--remove-all", action="store_true", help="Removes all documents")
    parser.add_argument("--list-docs", action="store_true", help="lists all documents")

    args = parser.parse_args()

    language: LanguageEnum
    if (args.language == "fr"):
        language = LanguageEnum.fr
    elif args.language == "en":
        language = LanguageEnum.en
    else:
        print("The only available languages are 'en' or 'fr'")
        return 1

    if args.list_docs:
        rag = RAG(language=language)
        store = DocumentStore(rag.vectorstore, rag.chroma_client)
        try:
            documents = store.list_documents()
            print("LIST OF DOCUMENTS:")
            print("id\tsource_id\tfile\tpage\tchunk")
            for doc in documents:
                print(str(doc['id']) + "\t" +
                      str(doc["metadata"]["source_id"]) + "\t" +
                      str(doc["metadata"]["source"]) + "\t" +
                      str(doc["metadata"]["page"]) + "\t" +
                      str(doc["metadata"]["chunk_id"]))
        except Exception as e:
            print(f"Error: {e}")
            return 1

    elif args.add_doc:
        rag = RAG(language=language)
        store = DocumentStore(rag.vectorstore, rag.chroma_client, language=language)

        try:
            id = int(args.add_doc[0])
        except ValueError:
            print("Error: ID must be an integer")
            return 1

        try:
            path = args.add_doc[1]

            if not Path(path).exists():
                raise Exception(f"file {path} doesnt exist.")

            store.add_file(path, id)
        except Exception as e:
            print(f"Error: {e}")
            return 1

    elif args.remove_doc:
        rag = RAG(language=language)
        store = DocumentStore(rag.vectorstore, rag.chroma_client)

        try:
            id = int(args.remove_doc)
            store.delete_document_by_id(id)
        except ValueError:
            print("Error: ID must be an integer")
            return 1
        except Exception as e:
            print(f"Error: {e}")
            return 1

    elif args.remove_all:
        rag = RAG(language=language)
        store = DocumentStore(rag.vectorstore, rag.chroma_client)

        try:
            store.delete_all_documents()
        except Exception as e:
            print(f"Error: {e}")
            return 1

    else:
        parser.print_help()

    return 0


if __name__ == "__main__":
    sys.exit(main())
