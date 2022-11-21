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

class CaseDocuments(BaseModel, db.Model):  # pylint: disable=too-many-public-methods
    """This class manages CaseDocuments against each form."""
    __tablename__ = "CaseDocuments"
    id = db.Column(db.Integer, primary_key=True)
    caseid = db.Column(
        db.Integer,ForeignKey("Cases.id"), nullable=True
    )
    documentref = db.Column(db.String(100), nullable=True)
    desc = db.Column(db.String(100), nullable=True)
    addedbyuserid = db.Column(db.String(100), nullable=True)

    # docCases = relationship(
    #     Cases, backref=backref("CaseEvents", uselist=True, cascade="delete,all")
    # )



 