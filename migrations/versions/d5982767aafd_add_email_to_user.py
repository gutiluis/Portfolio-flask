"""add email to user

Revision ID: d5982767aafd
Revises: d28ae1e99f93
Create Date: 2026-11-06 14:27:08.780018

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d5982767aafd"
down_revision = "d28ae1e99f93"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("user") as batch_op:
        batch_op.add_column(sa.Column("email", sa.String(length=120), nullable=True))
        batch_op.create_unique_constraint("uq_user_email", ["email"])


def downgrade():
    with op.batch_alter_table("user") as batch_op:
        batch_op.drop_constraint("uq_user_email", type_="unique")
        batch_op.drop_column("email")
    # ### end Alembic commands ###
