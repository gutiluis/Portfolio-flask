"""add owner user table

Revision ID: d28ae1e99f93
Revises: 
Create Date: 2026-10-28 23:51:43.779528

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd28ae1e99f93'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=80), nullable=False),
        sa.Column('password_hash', sa.String(length=256), nullable=False),
        sa.Column('is_owner', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username'),
    )

    with op.batch_alter_table('projects') as batch_op:
        batch_op.alter_column(
            'skills',
            new_column_name='technologies',
            existing_type=sa.Text(),
            existing_nullable=False,
        )


def downgrade():
    with op.batch_alter_table('projects') as batch_op:
        batch_op.alter_column(
            'technologies',
            new_column_name='skills',
            existing_type=sa.Text(),
            existing_nullable=False,
        )

    op.drop_table('user')
