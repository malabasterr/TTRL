from typing import Any

from sqlalchemy.ext.declarative import as_declarative


@as_declarative()
class Base:
    id: Any

    # Generate __tablename__ automatically
    # @declared_attr
    # def __tablename__(cls) -> str:
    #     return cls.__name__.lower()
    def __repr__(self) -> str:
        public_attr = {key: value for key, value in self.__dict__.items() if not key.startswith("_")}
        return f"{self.__class__.__name__}({public_attr!r})"
