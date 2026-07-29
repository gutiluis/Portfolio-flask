# Portfolio with SQLAlchemy

---

## How it works:
- python3 -m venv venv
- source venv/bin/activate
- pip install -r requirements
- python3 app.py



-----

## Features:

- ORM
- Relational Database
- html, css, jinja2, flask, python

----

## Tech-Stack:

- Python
- Flask
- SQLAlchemy
- SQLite
- Github
- Git
- Jinja2
- HTML
- CSS

---

## Skills:

#### SQLite relational db file

### Flask-AQLAlchemy
- __tablename__ is assumed with flasksqlalchemy extension within the model
- flask sqlalchemy manages a session per request. open, add, commit or rollback, and session closed()

### SQLAlchemy
- db_column_model
- imperative mapping and declarative mapping

#### Flask:
- render_template
- url_for:
  - send-subbmit the html form. not just leave it in the browser user-agent as a post request
  - used to implement an internal flask route function
- redirect
- request:
  -proxy
  -access incoming request data after using url_for and GET and POST methods
- app context(). create_all()

### JINJA2:
- for loops
- blocks
- the child file does not have body, or head html tags
- cannot define twice a block in the base
- only if the child has new code the layout should have a block
- use double quotes for html attributes
- order of attributes does not matter. however there is a convention

#### Automatic autoescaping in jinja templates

#### Bootstrap:
- css framework with optional javascript
- <link> tag inside the head for css
- <scrip></script> tag for javascript
- use bootstrap in head and body before closing the body
- bundle: modals, dropdowns, collapse, tooltips, popovers, carousel
- subresource integrity (SRI)
- bootstrap.css classes
- bootstap.js
- removed crossorigin and integrity hash

### CSS
    - At-rules
        - keyframes
        - mediaqueries

### custom error pages in flask

### HTML:
    - the same name of the form attribute should be used with sqlalchemy when creating the model object instance
    - within the form the required attribute does not affect the nullable=false within the sqlalchemy model

# http:
    - 302 found request post, 200, 304
    - cache
    - GET, POST
    - URI

# how to use sqlite3 CLI:
    - sqlite3 db_file.db
    - .tables
    - select * from table_name;
    - .schema table_name;
    - PRAGMA table_info(projects);
    
    # update sqlitedb with or without transactions
    - UPDATE project
    - SET id = '2'
    - WHERE id = 1;


    # safer to do a transaction directly sqlite3 in db form cli
    BEGIN;

    UPDATE projects
    SET github_repo = 'https://github.com/gutiluis/Techdegree-project-5'
    WHERE id = 1;
    # check
    SELECT id, github_repo FROM projects WHERE id = 1;

    COMMIT;


    # use not null to force the column always have input

### aplying an href to an anchor changes the font. the goal is using an url_for flask route


### difference between string parse time and string parse format time
model needs a datetime object. strptime

### get appearse in the browser. post doesnt

### using strftime within jinja template to display only year and month


### value does not work with jinja from the form in textarea tags
In HTML, the initial content of a <textarea> is specified between its opening and closing tags, not as a value attribute.

### flask error handling not for normal control flow
### not to replace validation
### not to hide bugs permanently
### error handling in flask is for exceptions

### request in flask
class flask.Request(environ, populate_request=True, shallow=False)¶
property form: ImmutableMultiDict[str, str]
The form parameters. By default an ImmutableMultiDict is returned from this function. This can be changed by setting parameter_storage_class to a different type. This might be necessary if the order of the form data is important.

### get_or_404(ident(Any), description=None)
Like get() but aborts with a 404 Not Found error instead of returning None.



https://flask.palletsprojects.com/en/2.2.x/errorhandling/?highlight=error%20page#custom-error-pages
-----

##
clone:
```bash
git clone https://github.com/gutiluis/Techdegree-project-5.git
```
