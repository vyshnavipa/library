import tornado.ioloop
import tornado.web
import pymysql
import json

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")

    def initialize(self, db):
        self.db = db

    def get_json_body(self):
        try:
            return json.loads(self.request.body)
        except json.JSONDecodeError:
            return None

    def options(self):
        # no body
        self.set_status(204)
        self.finish()

class GetBooksHandler(BaseHandler):
    def get(self):
        cursor = self.db.cursor()
        cursor.execute("SELECT * FROM books")
        books = cursor.fetchall()
        # Format the result as a list of dictionaries
        books_list = [{ "title": book[0], "author": book[1]} for book in books]
        self.write(json.dumps(books_list))


class AddBookHandler(BaseHandler):
    def post(self):
        data = self.get_json_body()
        if data:
            try:
                cursor = self.db.cursor()
                cursor.execute("INSERT INTO books (title, author) VALUES (%s, %s)",
                               (data["title"], data["author"]))
                self.db.commit()
                self.write({"message": "Book added successfully"})
            except Exception as e:
                self.write({"error": f"Error adding book: {str(e)}"})
        else:
            self.write({"error": "Invalid data"})

class DeleteBookHandler(BaseHandler):
    def delete(self):
        try:
            data = json.loads(self.request.body)
            title = data['title']
            cursor = self.db.cursor()
            cursor.execute("DELETE FROM books WHERE title = %s", (title,))
            self.db.commit()
            if cursor.rowcount == 0:
                raise ValueError(f"No book found with title '{title}'")
            self.write({"message": "Book deleted successfully"})
        except Exception as e:
            print(f"Error deleting book with title '{title}': {str(e)}")
            self.write({"error": f"Error deleting book: {str(e)}"})

    def options(self):
        self.set_status(204)
        self.finish()

def make_app():
    print("Connecting to the database...")
    db = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='library',
        port=3307
    )
    print("Connected to the database.")
    return tornado.web.Application([
        (r"/api/books", GetBooksHandler, dict(db=db)),
        (r"/api/books/add", AddBookHandler, dict(db=db)),
        (r"/api/books/delete", DeleteBookHandler, dict(db=db)),
    ])


if __name__ == "__main__":
    app = make_app()
    print("Starting the Tornado server on port 8888...")
    app.listen(8888)
    print("Tornado server started.")
    tornado.ioloop.IOLoop.current().start()
