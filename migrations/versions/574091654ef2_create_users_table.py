from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import UUID

revision: str = '574091654ef2'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('user',
                    sa.Column('uuid', UUID(as_uuid=True), nullable=False),
                    sa.Column('githubLogin', sa.String(length=128), nullable=False),
                    sa.Column('email', sa.String(length=128), nullable=False),
                    sa.Column('name', sa.String(length=128), nullable=False),
                    sa.Column('avatarUrl', sa.String(length=128), nullable=False),
                    sa.PrimaryKeyConstraint('uuid')
                    )


def downgrade() -> None:
    op.drop_table('user')
