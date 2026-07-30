>[!WARNING]
>CURRENTLY UNDER DEVELOPMENT


# Portfolio Web App with SQLAlchemy and Flask

Static app and API rendering templates for admin

---

## How it works

```
git clone https://github.com/gutiluis/Portfolio-flask.git
python3 -m venv venv
source venv/bin/activate
pip install -r requirements
python3 app.py
```

---

## Features

- ORM
- Relational Database
- HTML, CSS, Jinja2, Flask, Python

----

## Tech-Stack

<table align="center">
  <tr>
    <th colspan="3" align="center"><h3>Tech Stack</h3></th>
  </tr>
  <tr>
    <td align="center">
      ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)<br>
      ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)<br>
      ![Jinja](https://img.shields.io/badge/Jinja-B41717?style=for-the-badge&logo=jinja&logoColor=white)
    </td>
    <td align="center">
      ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)<br>
      ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)<br>
      ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
    </td>
    <td align="center">
      ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)<br>
      ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)<br>
      ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
    </td>
  </tr>
</table>

---

## Skills

### SQLite relational db

### Flask-AQLAlchemy

- __tablename__ is assumed with flasksqlalchemy extension within the model
- flask sqlalchemy manages a session per request. open, add, commit or rollback, and session closed()

### SQLAlchemy

- db_column_model
- imperative mapping and declarative mapping

### Flask

- render_template
- url_for:
  - send-subbmit the html form. not just leave it in the browser user-agent as a post request
  - used to implement an internal flask route function
- redirect
- request:
  -proxy
  -access incoming request data after using url_for and GET and POST methods
- app context(). create_all()

### JINJA2

- for loops
- blocks
- the child file does not have body, or head html tags
- cannot define twice a block in the base
- only if the child has new code the layout should have a block
- use double quotes for html attributes
- order of attributes does not matter. however there is a convention

#### Automatic autoescaping in jinja templates

### Bootstrap

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

### HTML

- The same name of the form attribute should be used with sqlalchemy when creating the model object instance
- Within the form the required attribute does not affect the nullable=false within the sqlalchemy model

### HTTP methods

- 302 found request post, 200, 304
- Cache
- GET, POST
- URI

### How to use sqlite3 CLI

- sqlite3 db_file.db
- .tables
- select * from table_name;
- .schema table_name;
- PRAGMA table_info(projects);
    
### Update sqlitedb with or without transactions
- UPDATE project
- SET id = '2'
- WHERE id = 1;

### Safer to do a transaction directly sqlite3 in db from CLI
BEGIN;

UPDATE projects
SET github_repo = 'https://github.com/gutiluis/Techdegree-project-5'
WHERE id = 1;
### Check
SELECT id, github_repo FROM projects WHERE id = 1;
COMMIT;

### Use not null to force the column always have input

### Applying an href to an anchor changes the font. the goal is using an url_for flask route

### Difference between string parse time and string parse format time
model needs a datetime object. strptime

### Get appears in the browser. post doesnt

### Using strftime within JINJA2 template to display only year and month


### Value does not work with jinja from the form in textarea tags
In HTML, the initial content of a <textarea> is specified between its opening and closing tags, not as a value attribute.

### Flask error handling not for normal control flow
### Not to replace validation
### Not to hide bugs permanently
### Error handling in flask is for exceptions

### Custom error pages in flask

### Request in flask:
class flask.Request(environ, populate_request=True, shallow=False)¶
property form: ImmutableMultiDict[str, str]
The form parameters. By default an ImmutableMultiDict is returned from this function. This can be changed by setting parameter_storage_class to a different type. This might be necessary if the order of the form data is important.

### get_or_404(ident(Any), description=None)
Like get() but aborts with a 404 Not Found error instead of returning None.
https://flask.palletsprojects.com/en/2.2.x/errorhandling/?highlight=error%20page#custom-error-pages

---

## Contributing

If you are interested in reporting/fixing issues and contributing directly to the code base, please see [CONTRIBUTING.md](https://github.com/gutiluis/.github/blob/main/CONTRIBUTING.md) for more information on what we're looking for and how to get started.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](https://github.com/gutiluis/.github/blob/main/CODE_OF_CONDUCT.md).

---

## Security Policy

If you discover a security vulnerability, please review our [Security Policy](https://github.com/gutiluis/.github/blob/main/SECURITY.md) for reporting guidelines.

---

## Support

If you run into any issues or have questions, please check our [SUPPORT.md](https://github.com/gutiluis/.github/blob/main/SUPPORT.md) file for guidance, or reach out through one of our community channels below.

---

## Community

Info on reporting bugs, getting help, finding third-party tools and sample apps, and more can be found on our **Community** channels:
* **Discord:** [Community channel](https://discord.gg/5xdAFuadP)
* **Slack Workspace:** [technobool.slack.com](https://technobool.slack.com)
* **GitHub Discussions:** [Open a discussion](https://github.com/gutiluis/Portfolio-flask/discussions)

---

### License

[MIT LICENSE](LICENSE)
