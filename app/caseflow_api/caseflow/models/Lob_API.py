"""This manages Application submission Data."""

from __future__ import annotations

from datetime import datetime

from flask_sqlalchemy import BaseQuery
from sqlalchemy import and_, func, or_
from sqlalchemy.sql.expression import text

from caseflow.models.case_events import CaseEvents
from caseflow.models.cases import Cases

from .base_model import BaseModel
from .db import db
from sqlalchemy.orm import backref, relationship
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSON
# from sqlalchemy.orm import relationship

class LobAPI(BaseModel, db.Model):  # pylint: disable=too-many-public-methods
    """This class manages LobAPI against each form."""
    __tablename__ = "LobAPI"
    id = db.Column(db.Integer, primary_key=True)  
    lobcasefieldname = db.Column(db.String(100), nullable=True)
    lobfieldmappedid = db.Column(db.Integer, nullable=True)
    lobconnectionsettings = db.Column(JSON, nullable=True)
  


 