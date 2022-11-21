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
# from sqlalchemy.orm import relationship

class CaseTypes(BaseModel, db.Model):  # pylint: disable=too-many-public-methods
    """This class manages CaseTypes against each form."""
    __tablename__ = "CaseTypes"
    id = db.Column(db.Integer, primary_key=True)   
    name = db.Column(db.String(100), nullable=True)
    displayname = db.Column(db.String(100), nullable=True)
    caseextrafields = db.Column(db.Integer,ForeignKey("CaseExtraFields.id"), nullable=True)
    lobfields = db.Column(db.Integer,ForeignKey("LobFields.id"), nullable=True)
    displaylocations = db.Column(db.Integer,ForeignKey("DisplayLocations.id"), nullable=True)

  


 