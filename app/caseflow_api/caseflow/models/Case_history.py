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

class CaseHistory(BaseModel, db.Model):  # pylint: disable=too-many-public-methods
    """This class manages CaseHistory against each form."""
    __tablename__ = "CaseHistory"
    id = db.Column(db.Integer, primary_key=True)   
    caseid = db.Column(db.Integer, nullable=True)
    datetime = db.Column(db.DateTime, nullable=True)
    eventid = db.Column(db.Integer,ForeignKey("CaseEvents.id"), nullable=True)
    outcome = db.Column(db.String(100), nullable=True)
    userid = db.Column(db.String(100), nullable=True)
 


 